import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

import { UserSession } from '~/users/interface'
import { CreateUserDto } from '~Users/dto'
import UserService from '~Users/users.service'

import { AuthDto } from './dto/auth.dto'
import { ITokensPair } from './interfaces'

@Injectable()
export default class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  static hashData(data: string): Promise<string> {
    return argon2.hash(data)
  }

  static async isValidData(hashedData: string, data: string) {
    return argon2.verify(hashedData, data)
  }

  async register(createUserDto: CreateUserDto): Promise<ITokensPair> {
    const hash = await AuthService.hashData(createUserDto.password)
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
    })

    const tokens = await this.getTokens(newUser._id, newUser.name, newUser.role)
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)

    return tokens
  }

  async login(data: AuthDto): Promise<ITokensPair> {
    const user = await this.userService.findByName(data.name)
    if (!user) throw new BadRequestException('User does not exist')

    const isPasswordMatch = await AuthService.isValidData(user.password, data.password)
    if (!isPasswordMatch) throw new BadRequestException('Password is incorrect')

    const tokens = await this.getTokens(user._id, user.name, user.role)
    await this.updateRefreshToken(user._id, tokens.refreshToken)

    return tokens
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null })
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await AuthService.hashData(refreshToken)
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  async getTokens(userId: string, username: string, role: string): Promise<ITokensPair> {
    const userData: UserSession = { id: userId, name: username, role }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(userData, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.EXPIRES_TIME_ACCESS_TOKEN,
      }),
      this.jwtService.signAsync(userData, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.EXPIRES_TIME_REFRESH_TOKEN,
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied')

    const refreshTokenMatches = await AuthService.isValidData(user.refreshToken, refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied')

    const tokens = await this.getTokens(user.id, user.name, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }
}
