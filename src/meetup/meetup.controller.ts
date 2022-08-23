import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { QueryParamsMeetup } from './dto'

import { CreateMeetupDto } from './dto/create-meetup.dto'
import { UpdateMeetupDto } from './dto/update-meetup.dto'
import { MeetupService } from './meetup.service'
import { Meetup } from './schemas/meetup.schema'

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  async getMeetups(@Res() res: Response, @Query() queryParams: QueryParamsMeetup) {
    let options = {}

    if (queryParams.tag) {
      options = {
        $or: [{ tags: new RegExp(queryParams.tag.toString(), 'i') }],
      }
    }

    try {
      const meetups = await this.meetupService.getAll(options).exec()
      const countOfMeetups = meetups.length

      if (!countOfMeetups) {
        throw new NotFoundException('No meetups found')
      }

      const page: number = parseInt(queryParams.page as any) || 1
      const countPerPage = parseInt(queryParams.countPerPage as any) || countOfMeetups
      const total = await this.meetupService.count(options)

      const query = this.meetupService.getAll(options)

      if (queryParams.sort) {
        if (queryParams.sort === 'asc' || queryParams.sort === 'desc') {
          query.sort({
            date: queryParams.sort,
          })
        } else {
          throw new BadRequestException('Check the querry value for sort')
        }
      }

      const result = await query
        .skip((page - 1) * countPerPage)
        .limit(countPerPage)
        .exec()

      return res.json({ result, total, countPerPage, page, lastPage: Math.ceil(total / countPerPage) })
    } catch (error) {
      if (error.response.statusCode === 400) {
        throw new BadRequestException(error.message)
      } else {
        throw new NotFoundException(error.message)
      }
    }
  }

  @Get(':id')
  async getById(@Res() res: Response, @Param('id') id: string) {
    try {
      const meetup = await this.meetupService.getById(id)
      if (!meetup) {
        throw new NotFoundException('Meetup does not exist')
      }
      return res.json(meetup)
    } catch (error) {
      throw new BadRequestException("Meetup ID doesn't exist")
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cashe-control', 'none')
  create(@Body() createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    return this.meetupService.create(createMeetupDto)
  }

  @Put(':id')
  async update(@Res() res: Response, @Body() updateMeetupDto: UpdateMeetupDto, @Param('id') id: string) {
    try {
      const meetup = await this.meetupService.update(id, updateMeetupDto)
      if (!meetup) {
        throw new NotFoundException('Meetup does not exist')
      }
      return res.json(meetup)
    } catch (err) {
      throw new BadRequestException("Meetup hasn't been updated. Check meetup ID")
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      const meetup = await this.meetupService.remove(id)
      if (!meetup) {
        throw new BadRequestException('Meetup does not exist')
      }
      return res.json(meetup)
    } catch (error) {
      throw new NotFoundException("Meetup ID doesn't exist")
    }
  }
}
