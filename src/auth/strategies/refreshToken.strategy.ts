import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { UserService } from 'src/users/users.service'
import { AuthService } from '../auth.service'

@Injectable()
export class RefresTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    super({
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['auth-cookie']
          if (!data) {
            return null
          }

          return data.refreshToken
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      ignoreExpiration: false,
    })
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      throw new UnauthorizedException()
    }

    const data = req?.cookies['auth-cookie']
    if (!data.refreshToken) {
      throw new BadRequestException('Refresh token doesn"t exist')
    }

    const userId = payload.sub
    const user = await this.userService.findById(userId)

    const isValidRefreshToken = await this.authService.isValidData(user.refreshToken, data.refreshToken)

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh token')
    }

    return payload
  }
}
