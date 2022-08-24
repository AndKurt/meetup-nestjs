import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { UserService } from 'src/users/users.service'
import { CreateUserDto, ExistingUserDTO } from 'src/users/dto'
import { IUserDetails } from 'src/users/interface/user-details.interface'
import { IAccessToken } from './interface/token'

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async isPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async validateUser(name: string, password: string): Promise<IUserDetails | null> {
    const user = await this.userService.findByName(name)
    const isUserExist = !!user

    if (!isUserExist) {
      throw new UnauthorizedException(`Account with name: ${name} doesn't exist!`)
    }

    const isPasswordMatch = await this.isPasswordMatch(password, user.password)

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password')
    }

    return this.userService.getUserDetails(user)
  }

  async login(existingUser: ExistingUserDTO): Promise<IAccessToken | null> {
    const { name, password } = existingUser
    const user = await this.validateUser(name, password)

    if (!user) throw new UnauthorizedException('Username or password is invalid!')

    const jwt = await this.jwtService.signAsync({ user })
    return { access_token: jwt }
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt)
      return { exp }
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT')
    }
  }
}
