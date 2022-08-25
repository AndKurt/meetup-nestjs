import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'

import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const data = req?.cookies['auth-cookie']
          if (!data) {
            return null
          }
          return data.accessToken
        },
      ]),
    })
  }

  async validate(payload: any) {
    if (payload === null) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
