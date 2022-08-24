import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserDto } from 'src/users/dto'

import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersServise: UsersService, private jwtServise: JwtService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersServise.findOne(username)

    if (user && user.password === pass) {
      const { password, ...rest } = user
      return { rest }
    }
    return null
  }

  async login(user: UserDto) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtServise.sign(payload),
    }
  }
}
