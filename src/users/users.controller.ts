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

import { IExtendedRequest } from '~/interfaces/extendedRequest'
import PermissionAbilityFactory from '~Ability/ability.factory'
import { AccessTokenGuard } from '~Auth/guards'
import { AbilityAction, Role } from '~Constants/ability'
import ErrorMsg from '~Constants/errorMsg'

import UpdateUserDto from './dto/update-user.dto'
import { IUserDetails } from './interface'
import UserService from './users.service'

@Controller('user')
export default class UserController {
  constructor(private userService: UserService, private readonly permissionAbilityFactory: PermissionAbilityFactory) {}

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
    @Req() req: IExtendedRequest,
  ): Promise<IUserDetails> {
    const activeUser = req.user
    const ability = this.permissionAbilityFactory.createForUser(activeUser)
    const userForUpdate = await this.userService.findById(id)
    const canUpdate = ability.can(AbilityAction.Update, userForUpdate)

    if (!canUpdate) {
      throw new ForbiddenException(ErrorMsg.NOT_ADMIN)
    }

    const user = await this.userService.update(id, updateUserDto)

    return { id: user._id, name: user.name, email: user.email, role: user.role }
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async remove(@Param('id') id: string, @Req() req: IExtendedRequest) {
    const activeUser = req.user
    const ability = this.permissionAbilityFactory.createForUser(activeUser)
    const userForDelete = await this.userService.findById(id)
    const canDeleteUser = ability.can(AbilityAction.Delete, userForDelete)

    if (!userForDelete) {
      throw new BadRequestException(`User ${ErrorMsg.DOES_NOT_EXIST}`)
    }
    if (!canDeleteUser) {
      throw new ForbiddenException(ErrorMsg.NOT_ADMIN)
    }
    await this.userService.remove(id)

    return { msg: 'User deleted' }
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  async removeAll(@Req() req: IExtendedRequest) {
    const activeUser = req.user

    const ability = this.permissionAbilityFactory.createForUser(activeUser)
    const canDeleteUsers = ability.can(AbilityAction.Delete, Role.ALL)

    if (!canDeleteUsers) {
      throw new ForbiddenException(ErrorMsg.NOT_ADMIN)
    }

    await this.userService.removeAll()

    return { msg: 'All user deleted' }
  }
}
