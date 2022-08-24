import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards'

import { CreateUserDto } from './dto'
import { IUserDetails } from './interface/user-details.interface'
import { UserService } from './users.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers(): Promise<IUserDetails[]> {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  getUser(@Param('id') id: string): Promise<IUserDetails | null> {
    return this.userService.findById(id)
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cashe-control', 'none')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUserDetails | null> {
    const user = await this.userService.create(createUserDto)
    return user
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<IUserDetails | string> {
    const user = await this.userService.remove(id)
    return user
  }
}
