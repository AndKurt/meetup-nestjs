import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RolesGuard } from './guards'
import { AccessTokenStrategy, RefresTokenStrategy } from './strategies'

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
  providers: [AuthService, AccessTokenStrategy, RefresTokenStrategy, RolesGuard],
})
export class AuthModule {}
