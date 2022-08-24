import { Module } from '@nestjs/common'

import { UsersService } from './users.service'

@Module({})
export class UsersModule {
  providers: [UsersService]
  exports: [UsersService]
}
