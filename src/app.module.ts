import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import AppController from '~/app.controller'
import AppService from '~/app.service'
import PermissionAbilityModule from '~Ability/ability.module'
import AuthModule from '~Auth/auth.module'
import MeetupModule from '~Meetup/meetup.module'
import UserModule from '~Users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MeetupModule,
    UserModule,
    AuthModule,
    PermissionAbilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
