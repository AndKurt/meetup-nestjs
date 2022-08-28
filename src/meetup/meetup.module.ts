import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CaslModule } from 'src/ability/ability.module'
import { RolesGuard } from 'src/auth/guards'

import { MeetupController } from './meetup.controller'
import { MeetupService } from './meetup.service'
import { Meetup, MeetupSchema } from './schemas/meetup.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Meetup.name, schema: MeetupSchema }]), CaslModule],
  providers: [MeetupService, RolesGuard],
  controllers: [MeetupController],
})
export class MeetupModule {}
