import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as mongoShema } from 'mongoose'

export type MeetupDocument = Meetup & Document

@Schema()
export class Meetup {
  _id: mongoShema.Types.ObjectId

  @Prop()
  title: string

  @Prop()
  description: string

  @Prop()
  tags: string[]

  @Prop()
  place: string

  @Prop()
  date: Date

  @Prop()
  ownerId: string
}

export const MeetupSchema = SchemaFactory.createForClass(Meetup)
