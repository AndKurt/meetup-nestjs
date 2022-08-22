import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MeetupModule } from './meetup/meetup.module'

@Module({
  imports: [
    MeetupModule,
    MongooseModule.forRoot(
      'mongodb+srv://meetup:1D6t3iZH1LTCemaL@cluster0.awbjyzi.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
