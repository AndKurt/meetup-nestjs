import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as argon2 from 'argon2'

import { UserService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  hashData(data: string) {
    return argon2.hash(data)
  }

  async isValidData(hashedData, data) {
    return await argon2.verify(hashedData, data)
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const hash = await this.hashData(createUserDto.password)
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
    })
    const tokens = await this.getTokens(newUser._id, newUser.name)
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)
    return tokens
  }

  async login(data: AuthDto): Promise<any> {
    const user = await this.userService.findByName(data.name)
    if (!user) throw new BadRequestException('User does not exist')

    const isPasswordMatch = await this.isValidData(user.password, data.password)
    if (!isPasswordMatch) throw new BadRequestException('Password is incorrect')

    const tokens = await this.getTokens(user._id, user.name)
    await this.updateRefreshToken(user._id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null })
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken)
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.EXPIRES_TIME_ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.EXPIRES_TIME_REFRESH_TOKEN,
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied')

    const refreshTokenMatches = await this.isValidData(user.refreshToken, refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(user.id, user.name)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }
}
