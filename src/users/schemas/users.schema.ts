import { Document, Schema as mongoShema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  _id: mongoShema.Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  refreshToken: string

  @Prop()
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User)
