import { Injectable } from '@nestjs/common'

import { UserDto } from './dto'

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
    {
      userId: 3,
      username: 'user',
      password: 'user',
    },
  ]

  async findOne(username: string): Promise<UserDto | undefined> {
    return this.users.find((user) => user.username === username)
  }
}