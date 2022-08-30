import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CaslModule } from 'src/ability/ability.module'

import { MeetupController } from './meetup.controller'
import { MeetupService } from './meetup.service'
import { meetupProviders } from './providers/meetup.providers'
import { Meetup } from './schemas/meetup-postgresql.schema'

@Module({
  imports: [CaslModule, SequelizeModule.forFeature([Meetup])],
  controllers: [MeetupController],
  providers: [MeetupService, ...meetupProviders],
  exports: [MeetupService],
})
export class MeetupModule {}
