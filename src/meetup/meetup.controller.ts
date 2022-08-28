import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { Action, CaslAbilityFactory } from 'src/ability/ability.factory'
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards'

import { CreateMeetupDto, QueryParamsMeetup, UpdateMeetupDto } from './dto'
import { MeetupService } from './meetup.service'
import { Meetup } from './schemas/meetup.schema'

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService, private readonly caslAbilityFactory: CaslAbilityFactory) {}

  @Get()
  async getMeetups(@Res() res: Response, @Query() queryParams: QueryParamsMeetup) {
    let options = {}

    if (queryParams.title) {
      options = {
        $or: [{ title: new RegExp(queryParams.title.toString(), 'i') }],
      }
    }
    if (queryParams.tag) {
      options = {
        $or: [{ tags: new RegExp(queryParams.tag.toString(), 'i') }],
      }
    }

    const meetups = await this.meetupService.getAll(options).exec()
    const countOfMeetups = meetups.length

    if (!countOfMeetups && Object.keys(options).length) {
      throw new BadRequestException('No meetups found. Check query parameters')
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
  }

  @Get(':id')
  async getById(@Res() res: Response, @Param('id') id: string) {
    try {
      const meetup = await this.meetupService.getById(id)
      if (!meetup) {
        throw new BadRequestException('Meetup does not exist')
      }
      return res.json(meetup)
    } catch (error) {
      throw new BadRequestException("Meetup ID doesn't exist")
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cashe-control', 'none')
  create(@Body() createMeetupDto: Omit<CreateMeetupDto, 'omwerId'>, @Req() req: Request): Promise<Meetup> {
    return this.meetupService.create({ ...createMeetupDto, ownerId: req.user['sub'] })
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(@Req() req: Request, @Body() updateMeetupDto: UpdateMeetupDto, @Param('id') id: string) {
    const activeUser = req.user
    const ability = this.caslAbilityFactory.createForUser(activeUser)
    const meetupForUpdate = await this.meetupService.getById(id)
    const canUpdate = ability.can(Action.Update, meetupForUpdate)

    if (!meetupForUpdate) {
      throw new NotFoundException('Meetup does not exist')
    }
    if (!canUpdate) {
      throw new ForbiddenException('You can"t update, because you are not an admin')
    }

    const meetup = await this.meetupService.update(id, updateMeetupDto)
    return meetup
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const activeUser = req.user
    const ability = this.caslAbilityFactory.createForUser(activeUser)
    const meetupForDelete = await this.meetupService.getById(id)
    const canDelete = ability.can(Action.Delete, meetupForDelete)

    if (!meetupForDelete) {
      throw new BadRequestException('Meetup does not exist')
    }
    if (!canDelete) {
      throw new ForbiddenException('You can"t delete, because you are not an admin')
    }

    await this.meetupService.remove(id)
    return { msg: `Meetup deleted` }
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  async removeAll(@Req() req: Request) {
    const activeUser = req.user
    const ability = this.caslAbilityFactory.createForUser(activeUser)
    const canDelete = ability.can(Action.Delete, 'all')

    if (!canDelete) {
      throw new ForbiddenException('You can"t delete, because you are not an admin')
    }

    await this.meetupService.removeAll()
    return { msg: `All meetups deleted` }
  }
}
