import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import UserModule from '~Users/users.module'

import AuthController from './auth.controller'
import AuthService from './auth.service'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: process.env.EXPIRES_TIME_ACCESS_TOKEN },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export default class AuthModule {}
