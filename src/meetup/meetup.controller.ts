import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common'

import { CreateMeetupDto } from './dto/create-meetup.dto'
import { UpdateMeetupDto } from './dto/update-meetup.dto'
import { MeetupService } from './meetup.service'
import { Meetup } from './schemas/meetup.schema'

@Controller('meetup')
export class MeetupController {
  constructor(private meetupService: MeetupService) {}

  @Get()
  getAll(): Promise<Meetup[]> {
    return this.meetupService.getAll()
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Meetup> {
    return this.meetupService.getById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cashe-control', 'none')
  create(@Body() createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    return this.meetupService.create(createMeetupDto)
  }

  @Put(':id')
  update(@Body() updateMeetupDto: UpdateMeetupDto, @Param('id') id: string) {
    return this.meetupService.update(id, updateMeetupDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetupService.remove(id)
  }
}
