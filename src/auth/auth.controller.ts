import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'

import { CreateUserDto } from 'src/users/dto'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { AccessTokenGuard, RefreshTokenGuard } from './guards'
import { getIdFromAccessToken } from './utils/decodeJwt'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(user)
    res.cookie('auth-cookie', tokens, { httpOnly: true })
    return tokens
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    const accessToken = req.cookies['auth-cookie'].accessToken
    const userId = getIdFromAccessToken(accessToken)
    this.authService.logout(userId)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['auth-cookie'].refreshToken
    const userId = getIdFromAccessToken(refreshToken)

    const tokens = await this.authService.refreshTokens(userId, refreshToken)
    res.cookie('auth-cookie', tokens, { httpOnly: true })
    return tokens
  }
}
