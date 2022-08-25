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
import { Roles } from 'src/auth/decorator/roles.decorator'
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards'
import { Role } from 'src/auth/models/role.enum'

import { CreateUserDto, UpdateUserDto } from './dto'
import { IUserDetails } from './interface/user-details.interface'
import { UserService } from './users.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id)
    return user
  }

  @Roles(Role.ADMIN)
  @Delete()
  @UseGuards(AccessTokenGuard)
  async removeAll() {
    const user = await this.userService.removeAll()
    return user
  }
}
