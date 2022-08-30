import { USER_REPOSITORY } from 'src/constants'
import { User } from '../schemas/users.schema-postgresql'

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
]
