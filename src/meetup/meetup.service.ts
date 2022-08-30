import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Op } from 'sequelize'
import { MEETUP_REPOSITORY } from 'src/constants'

import { CreateMeetupDto, UpdateMeetupDto } from './dto'
import { Meetup } from './schemas/meetup-postgresql.schema'

@Injectable()
export class MeetupService {
  constructor(@Inject(MEETUP_REPOSITORY) private readonly meetupModel: typeof Meetup) {}

  async getAll() {
    return await this.meetupModel.findAll()
  }

  async getAllwithQuery(title: string, tag: string, sort: string, offset: number, countPerPage: number) {
    return await this.meetupModel.findAndCountAll({
      where: {
        title: { [Op.substring]: title || '' },
        tags: { [Op.contains]: tag ? [tag] : [] },
      },
      order: [['date', sort ? sort.toLocaleUpperCase() : 'NULLS FIRST']],
      offset: offset,
      limit: countPerPage,
    })
  }

  async findById(id: string): Promise<Meetup> {
    return await this.meetupModel.findOne<Meetup>({ where: { id } })
  }

  async create(meetupDto: CreateMeetupDto): Promise<Meetup> {
    const newMeetup = await this.meetupModel.create<Meetup>(meetupDto)
    return newMeetup.save()
  }

  async remove(id: string): Promise<Meetup> {
    const meetup = await this.findById(id)

    if (!meetup) {
      throw new ConflictException(`Account with ID: ${id} doesn't exist!`)
    }
    await this.meetupModel.destroy({ where: { id } })
    return meetup
  }

  async update(id: string, meetupDto: UpdateMeetupDto): Promise<Meetup> {
    await this.meetupModel.update(meetupDto, { where: { id: id } })
    const meetup = await this.findById(id)
    return meetup
  }

  async removeAll() {
    return this.meetupModel.destroy({
      where: {},
      truncate: true,
    })
  }
}
