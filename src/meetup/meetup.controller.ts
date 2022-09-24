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
import { Response } from 'express'
import { AccessTokenGuard } from 'src/auth/guards'

import PermissionAbilityFactory from '~Ability/ability.factory'
import { AbilityAction, Role } from '~Constants/ability'
import ErrorMsg from '~Constants/errorMsg'
import SORTING from '~Constants/queryParams'
import { IExtendedRequest } from '~Interfaces/extendedRequest'

import { CreateMeetupDto, QueryParamsMeetup, UpdateMeetupDto } from './dto'
import MeetupService from './meetup.service'
import { Meetup } from './schemas/meetup.schema'

@Controller('meetup')
export default class MeetupController {
  constructor(
    private readonly meetupService: MeetupService,
    private readonly permissionAbilityFactory: PermissionAbilityFactory,
  ) {}

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
      throw new BadRequestException(ErrorMsg.CHECK_PARAMS)
    }

    const page: number = parseInt(queryParams.page, 10) || 1
    const countPerPage = parseInt(queryParams.countPerPage, 10) || countOfMeetups
    const total = await this.meetupService.count(options)

    const query = this.meetupService.getAll(options)

    if (queryParams.sort) {
      if (queryParams.sort === SORTING.ASCENDING || queryParams.sort === SORTING.DESCENDING) {
        query.sort({
          date: queryParams.sort,
        })
      } else {
        throw new BadRequestException(ErrorMsg.CHECK_PARAMS)
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
        throw new BadRequestException(`Meetup ${ErrorMsg.DOES_NOT_EXIST}`)
      }

      return res.json(meetup)
    } catch (error) {
      throw new BadRequestException(`Meetup ID ${ErrorMsg.DOES_NOT_EXIST}`)
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-control', 'none')
  create(@Body() createMeetupDto: Omit<CreateMeetupDto, 'ownerId'>, @Req() req: IExtendedRequest): Promise<Meetup> {
    return this.meetupService.create({ ...createMeetupDto, ownerId: req.user.id })
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(@Req() req: IExtendedRequest, @Body() updateMeetupDto: UpdateMeetupDto, @Param('id') id: string) {
    const activeUser = req.user

    const ability = this.permissionAbilityFactory.createForUser(activeUser)
    const meetupForUpdate = await this.meetupService.getById(id)
    const canUpdate = ability.can(AbilityAction.Update, meetupForUpdate)

    if (!meetupForUpdate) {
      throw new NotFoundException(`Meetup ${ErrorMsg.DOES_NOT_EXIST}`)
    }
    if (!canUpdate) {
      throw new ForbiddenException(ErrorMsg.NOT_ADMIN)
    }

    const meetup = await this.meetupService.update(id, updateMeetupDto)

    return meetup
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: IExtendedRequest) {
    const activeUser = req.user

    const ability = this.permissionAbilityFactory.createForUser(activeUser)
    const meetupForDelete = await this.meetupService.getById(id)
    const canDelete = ability.can(AbilityAction.Delete, meetupForDelete)

    if (!meetupForDelete) {
      throw new BadRequestException(`Meetup ${ErrorMsg.DOES_NOT_EXIST}`)
    }
    if (!canDelete) {
      throw new ForbiddenException(ErrorMsg.NOT_ADMIN)
    }

    await this.meetupService.remove(id)

    return { msg: 'Meetup deleted' }
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  async removeAll(@Req() req: IExtendedRequest) {
    const activeUser = req.user
    const ability = this.permissionAbilityFactory.createForUser(activeUser)
    const canDelete = ability.can(AbilityAction.Delete, Role.ALL)

    if (!canDelete) {
      throw new ForbiddenException(ErrorMsg.NOT_ADMIN)
    }

    const countDeletedMeetups = await this.meetupService.removeAll()

    return { msg: `${countDeletedMeetups.deletedCount} meetups deleted` }
  }
}
