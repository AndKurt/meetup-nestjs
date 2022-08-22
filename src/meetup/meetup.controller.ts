import { Controller, Get } from '@nestjs/common'

import { MeetupService } from './meetup.service'

@Controller('meetup')
export class MeetupController {
  constructor(private meetupService: MeetupService) {}

  @Get()
  test(): string {
    return this.meetupService.test()
  }
}
