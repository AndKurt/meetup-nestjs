import { MEETUP_REPOSITORY } from 'src/constants'
import { Meetup } from '../schemas/meetup-postgresql.schema'

export const meetupProviders = [
  {
    provide: MEETUP_REPOSITORY,
    useValue: Meetup,
  },
]
