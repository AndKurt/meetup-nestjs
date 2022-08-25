import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AccessTokenGuard } from 'src/auth/guards'

import { CreateUserDto, UpdateUserDto } from './dto'
import { IUserDetails } from './interface/user-details.interface'
import { UserService } from './users.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id)
    return user
  }
}
