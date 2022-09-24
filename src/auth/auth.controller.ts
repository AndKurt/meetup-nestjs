import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { CreateUserDto } from 'src/users/dto'

import AuthService from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { AccessTokenGuard, RefreshTokenGuard } from './guards'
import { getIdFromAccessToken } from './utils'

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(createUserDto)
    res.cookie('auth-cookie', tokens, { httpOnly: true })

    return { accessToken: tokens.accessToken, msg: 'User created successful' }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(user)
    res.cookie('auth-cookie', tokens, { httpOnly: true })

    return { accessToken: tokens.accessToken, msg: 'Login successful' }
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const { accessToken } = req.cookies['auth-cookie']
    const userId = getIdFromAccessToken(accessToken)
    this.authService.logout(userId)

    return { msg: 'Logout successful' }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies['auth-cookie']
    const userId = getIdFromAccessToken(refreshToken)
    const tokens = await this.authService.refreshTokens(userId, refreshToken)
    res.cookie('auth-cookie', tokens, { httpOnly: true })

    return { accessToken: tokens.accessToken, msg: 'Refresh tokens successful' }
  }
}
