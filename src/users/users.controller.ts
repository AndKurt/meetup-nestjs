import { ForbiddenError } from '@casl/ability'
import { Body, Controller, Delete, Get, Param, Patch, UseGuards, Req, ForbiddenException } from '@nestjs/common'
import { Request } from 'express'

import { Roles } from 'src/auth/decorator/roles.decorator'
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards'
import { Role } from 'src/auth/models/role.enum'
import { UpdateUserDto } from './dto'
import { IUserDetails } from './interface/user-details.interface'
import { UserService } from './users.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<IUserDetails[]> {
    const users = await this.userService.getAllUsers()
    return users.map((user) => ({ id: user._id, name: user.name, email: user.email, role: user.role }))
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<IUserDetails> {
    const user = await this.userService.findById(id)
    return { id: user._id, name: user.name, email: user.email, role: user.role }
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IUserDetails> {
    const user = await this.userService.update(id, updateUserDto)
    return { id: user._id, name: user.name, email: user.email, role: user.role }
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    await this.userService.remove(id)
    return { msg: `User deleted` }
  }

  @Roles(Role.ADMIN)
  @Delete()
  @UseGuards(AccessTokenGuard)
  async removeAll() {
    const user = await this.userService.removeAll()
    return user
  }
}
