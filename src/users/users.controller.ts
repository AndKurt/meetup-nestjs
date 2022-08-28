import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { Request } from 'express'
import { Action, CaslAbilityFactory } from 'src/ability/ability.factory'

import { AccessTokenGuard, RolesGuard } from 'src/auth/guards'
import { UpdateUserDto } from './dto'
import { IUserDetails } from './interface/user-details.interface'
import { UserService } from './users.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private readonly caslAbilityFactory: CaslAbilityFactory) {}

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

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<IUserDetails> {
    const activeUser = req.user
    const ability = this.caslAbilityFactory.createForUser(activeUser)
    const userForUpdate = await this.userService.findById(id)
    const canUpdate = ability.can(Action.Update, userForUpdate)

    if (!canUpdate) {
      throw new ForbiddenException('You can"t update, because you are not an admin')
    }

    const user = await this.userService.update(id, updateUserDto)
    return { id: user._id, name: user.name, email: user.email, role: user.role }
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    const activeUser = req.user
    const ability = this.caslAbilityFactory.createForUser(activeUser)
    const userForDelete = await this.userService.findById(id)
    const canDeleteUser = ability.can(Action.Delete, userForDelete)

    if (!userForDelete) {
      throw new BadRequestException('User does not exist')
    }
    if (!canDeleteUser) {
      throw new ForbiddenException('You can"t delete, because you are not an admin')
    }
    await this.userService.remove(id)
    return { msg: `User deleted` }
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  async removeAll(@Req() req: Request) {
    const activeUser = req.user
    const ability = this.caslAbilityFactory.createForUser(activeUser)
    const canDeleteUsers = ability.can(Action.Delete, 'all')

    if (!canDeleteUsers) {
      throw new ForbiddenException('You can"t delete, because you are not an admin')
    }

    await this.userService.removeAll()
    return { msg: `All user deleted` }
  }
}
