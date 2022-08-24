import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_TIME_ACCESS_TOKEN },
    }),
  ],
  providers: [AuthService, LocalStrategy, UsersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
