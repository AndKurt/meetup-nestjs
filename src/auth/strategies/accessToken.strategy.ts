import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserSession } from '~Users/interface'

import { extractToken } from '../utils'

@Injectable()
export default class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const extract = extractToken('accessToken')
          const accessToken = extract(req)

          return accessToken
        },
      ]),
    })
  }

  // eslint-disable-next-line class-methods-use-this
  async validate(payload: UserSession) {
    if (!payload) throw new UnauthorizedException()

    return payload
  }
}
