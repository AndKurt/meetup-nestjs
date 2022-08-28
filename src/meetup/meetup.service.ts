import { Model } from 'mongoose'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Meetup, MeetupDocument } from './schemas/meetup.schema'
import { CreateMeetupDto, UpdateMeetupDto } from './dto'

@Injectable()
export class MeetupService {
  constructor(@InjectModel(Meetup.name) private meetupModel: Model<MeetupDocument>) {}

  getAll(options) {
    return this.meetupModel.find(options)
  }

  count(options) {
    return this.meetupModel.count(options).exec()
  }

  async getById(id: string): Promise<MeetupDocument> {
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return this.meetupModel.findById(id)
      } else {
        throw new BadRequestException()
      }
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async create(meetupDto: CreateMeetupDto): Promise<Meetup> {
    const newMeetup = new this.meetupModel(meetupDto)
    return newMeetup.save()
  }

  async remove(id: string): Promise<MeetupDocument> {
    try {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const meetup = this.meetupModel.findByIdAndRemove(id)
        return meetup
      } else {
        throw new BadRequestException()
      }
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async update(id: string, meetupDto: UpdateMeetupDto): Promise<Meetup> {
    await this.meetupModel.findByIdAndUpdate(id, meetupDto)
    const meetup = await this.meetupModel.findById(id)
    return meetup
  }

  async removeAll(): Promise<any> {
    return this.meetupModel.deleteMany()
  }
}
