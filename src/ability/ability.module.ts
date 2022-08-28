import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Meetup, MeetupSchema } from 'src/meetup/schemas/meetup.schema'
import { User, UserSchema } from 'src/users/schemas/users.schema'
import { CaslAbilityFactory } from './ability.factory'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Meetup.name, schema: MeetupSchema }]),
  ],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
