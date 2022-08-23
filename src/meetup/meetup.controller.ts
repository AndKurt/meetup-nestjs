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
  Res,
} from '@nestjs/common'
import { Response } from 'express'

import { CreateMeetupDto } from './dto/create-meetup.dto'
import { UpdateMeetupDto } from './dto/update-meetup.dto'
import { MeetupService } from './meetup.service'
import { Meetup } from './schemas/meetup.schema'

@Controller('meetup')
export class MeetupController {
  constructor(private meetupService: MeetupService) {}

  @Get()
  async getAll(@Res() res: Response) {
    try {
      const meetups = await this.meetupService.getAll()
      if (!meetups.length) {
        throw new NotFoundException('No meetups found')
      }
      return res.json(meetups)
    } catch (error) {
      throw new NotFoundException('Not found')
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
        throw new NotFoundException('Meetup does not exist')
      }
      return res.json(meetup)
    } catch (error) {
      throw new BadRequestException("Meetup ID doesn't exist")
    }
  }
}
