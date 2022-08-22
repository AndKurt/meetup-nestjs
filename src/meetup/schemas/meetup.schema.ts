import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type MeetupDocument = Meetup & Document

@Schema()
export class Meetup {
  @Prop()
  title: string

  @Prop()
  description: string
}

export const MeetupSchema = SchemaFactory.createForClass(Meetup)
