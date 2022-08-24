import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { ExistingUserDTO } from 'src/users/dto'
import { AuthService } from './auth.service'
import { IAccessToken } from './interface/token'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDTO): Promise<IAccessToken | null> {
    return this.authService.login(user)
  }

  @Post('verify-jwt')
  @HttpCode(HttpStatus.OK)
  verifyJwt(@Body() payload: { jwt: string }) {
    return this.authService.verifyJwt(payload.jwt)
  }
}
