import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserSession } from '~Users/interface'
import UserService from '~Users/users.service'

import AuthService from '../auth.service'
import { extractToken } from '../utils'

@Injectable()
export default class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const extract = extractToken('refreshToken')
          const refreshToken = extract(req)

          return refreshToken
        },
      ]),
    })
  }

  async validate(req: Request, payload: UserSession) {
    const extract = extractToken('refreshToken')
    const refreshToken = extract(req)
    if (!refreshToken) throw new BadRequestException('Refresh token doesn"t exist')

    const userId = payload.id
    const user = await this.userService.findByIdForValidateToken(userId)

    const isValidRefreshToken = await AuthService.isValidData(user.refreshToken, refreshToken)

    if (!isValidRefreshToken) throw new UnauthorizedException('Invalid Refresh token')

    return payload
  }
}
