import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Meetup, MeetupDocument } from './schemas/meetup.schema'
import { CreateMeetupDto } from './dto/create-meetup.dto'
import { UpdateMeetupDto } from './dto/update-meetup.dto'

@Injectable()
export class MeetupService {
  constructor(@InjectModel(Meetup.name) private meetupModel: Model<MeetupDocument>) {}

  async getAll(): Promise<Meetup[]> {
    return this.meetupModel.find().exec()
  }

  async getById(id: string): Promise<Meetup> {
    return this.meetupModel.findById(id)
  }

  async create(meetupDto: CreateMeetupDto): Promise<Meetup> {
    const newMeetup = new this.meetupModel(meetupDto)
    return newMeetup.save()
  }

  async remove(id: string): Promise<Meetup> {
    console.log(id)
    return this.meetupModel.findByIdAndDelete(id)
  }

  async update(id: string, meetupDto: UpdateMeetupDto): Promise<Meetup> {
    return this.meetupModel.findByIdAndUpdate(id, meetupDto, { new: true })
  }
}
