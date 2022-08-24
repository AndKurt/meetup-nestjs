import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MeetupModule } from './meetup/meetup.module'
import { AuthModule } from './auth/auth.module'
import { UsersService } from './users/users.service'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MeetupModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
