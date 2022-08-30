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
import { AccessTokenGuard } from 'src/auth/guards'

import { CreateMeetupDto, QueryParamsMeetup, UpdateMeetupDto } from './dto'
import { MeetupService } from './meetup.service'
import { Meetup } from './schemas/meetup-postgresql.schema'

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService, private readonly caslAbilityFactory: CaslAbilityFactory) {}

  @Get()
  async getMeetups(@Query() queryParams: QueryParamsMeetup) {
    const meetups = await this.meetupService.getAll()
    const countOfMeetups = meetups.length

    const startPage = queryParams.page ? parseInt(queryParams.page as any) - 1 : 0
    const countPerPage = queryParams.countPerPage ? parseInt(queryParams.countPerPage as any) : countOfMeetups
    const offset = countPerPage * startPage

    const { count, rows } = await this.meetupService.getAllwithQuery(
      queryParams.title,
      queryParams.tag,
      queryParams.sort,
      offset,
      countPerPage,
    )

    if (countOfMeetups && !count && Object.keys(queryParams).length) {
      throw new BadRequestException('No meetups found. Check query parameters')
    }

    return {
      total: count,
      countPerPage,
      startPage: startPage + 1,
      lastPage: Math.ceil(count / countPerPage),
      result: rows,
    }
  }

  @Get(':id')
  async getById(@Res() res: Response, @Param('id') id: string) {
    try {
      const meetup = await this.meetupService.findById(id)
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
    const meetupForUpdate = await this.meetupService.findById(id)
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
    const meetupForDelete = await this.meetupService.findById(id)
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
