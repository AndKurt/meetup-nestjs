import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateMeetupDto, UpdateMeetupDto } from './dto'
import { Meetup, MeetupDocument } from './schemas/meetup.schema'

@Injectable()
export default class MeetupService {
  constructor(@InjectModel(Meetup.name) private meetupModel: Model<MeetupDocument>) {}

  getAll(options) {
    return this.meetupModel.find(options)
  }

  count(options) {
    return this.meetupModel.count(options).exec()
  }

  async getById(id: string): Promise<MeetupDocument> {
    return this.meetupModel.findById(id)
  }

  async create(meetupDto: CreateMeetupDto): Promise<Meetup> {
    // eslint-disable-next-line new-cap
    const newMeetup = new this.meetupModel(meetupDto)

    return newMeetup.save()
  }

  async remove(id: string): Promise<MeetupDocument> {
    return this.meetupModel.findByIdAndRemove(id)
  }

  async update(id: string, meetupDto: UpdateMeetupDto): Promise<Meetup> {
    return this.meetupModel.findByIdAndUpdate(id, meetupDto, { new: true })
  }

  async removeAll(): Promise<{ deletedCount: number }> {
    return this.meetupModel.deleteMany()
  }
}
