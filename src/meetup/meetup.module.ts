import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import PermissionAbilityModule from '~Ability/ability.module'

import MeetupController from './meetup.controller'
import MeetupService from './meetup.service'
import { Meetup, MeetupSchema } from './schemas/meetup.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Meetup.name, schema: MeetupSchema }]), PermissionAbilityModule],
  providers: [MeetupService],
  controllers: [MeetupController],
})
export default class MeetupModule {}
