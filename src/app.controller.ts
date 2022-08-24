import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local-auth.guards'

@Controller()
export class AppController {
  constructor(private readonly authServise: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authServise.login(req.user)
  }
}
