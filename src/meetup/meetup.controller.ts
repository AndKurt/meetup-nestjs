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
  Req,
  Res,
} from '@nestjs/common'
import { Response, Request } from 'express'

import { CreateMeetupDto } from './dto/create-meetup.dto'
import { UpdateMeetupDto } from './dto/update-meetup.dto'
import { MeetupService } from './meetup.service'
import { Meetup } from './schemas/meetup.schema'

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  //@Get()
  //async getAll(@Res() res: Response) {
  //  try {
  //    const meetups = await this.meetupService.getAll({}).exec()
  //    if (!meetups.length) {
  //      throw new NotFoundException('No meetups found')
  //    }
  //    return res.json(meetups)
  //  } catch (error) {
  //    throw new NotFoundException('Not found')
  //  }
  //}

  @Get()
  async getMeetups(@Req() req: Request, @Res() res: Response) {
    let options = {}

    if (req.query.tag) {
      options = {
        $or: [
          { tags: new RegExp(req.query.tag.toString(), 'i') },
          //{ description: new RegExp(req.query.s.toString(), 'i') },
        ],
      }
    }

    try {
      const meetups = await this.meetupService.getAll(options).exec()
      const countOfMeetups = meetups.length
      if (!countOfMeetups) {
        throw new NotFoundException('No meetups found')
        //}
      }

      const page: number = parseInt(req.query.page as any) || 1
      const countPerPage = parseInt(req.query.countPerPage as any) || countOfMeetups
      const total = await this.meetupService.count(options)

      const result = await this.meetupService
        .getAll(options)
        .skip((page - 1) * countPerPage)
        .limit(countPerPage)
        .exec()

      return res.json({ result, total, countPerPage, page, lastPage: Math.ceil(total / countPerPage) })
    } catch (error) {
      throw new NotFoundException('Not found')
    }

    const query = await this.meetupService.getAll(options).exec()

    //if (req.query.sort) {
    //query.sort({
    //date: req.query.sort,
    //})
    //}

    //const page: number = parseInt(req.query.page as any) || 1
    //const limit = 9
    //const total = await this.meetupService.count(options)

    //const data = await query
    //  .skip((page - 1) * limit)
    //  .limit(limit)
    //  .exec()

    console.log(query)
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
