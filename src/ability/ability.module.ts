import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import PermissionAbilityFactory from '~Ability/ability.factory'
import { Meetup, MeetupSchema } from '~Meetup/schemas/meetup.schema'
import { User, UserSchema } from '~Users/schemas/users.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Meetup.name, schema: MeetupSchema }]),
  ],
  providers: [PermissionAbilityFactory],
  exports: [PermissionAbilityFactory],
})
export default class PermissionAbilityModule {}
