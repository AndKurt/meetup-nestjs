import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import PermissionAbilityModule from '~Ability/ability.module'

import { User, UserSchema } from './schemas/users.schema'
import UserController from './users.controller'
import UserService from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PermissionAbilityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
