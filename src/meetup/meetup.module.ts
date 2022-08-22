import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MeetupController } from './meetup.controller'
import { MeetupService } from './meetup.service'
import { Meetup, MeetupSchema } from './schemas/meetup.schema'

@Module({
  providers: [MeetupService],
  controllers: [MeetupController],
  imports: [MongooseModule.forFeature([{ name: Meetup.name, schema: MeetupSchema }])],
})
export class MeetupModule {}
