import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import PermitionAbilityModule from '~Ability/ability.module'

import { User, UserSchema } from './schemas/users.schema'
import UserController from './users.controller'
import UserService from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PermitionAbilityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
