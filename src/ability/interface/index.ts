import { Ability, InferSubjects } from '@casl/ability'

import { AbilityAction, Role } from '~Constants/ability'
import { Meetup } from '~Meetup/schemas/meetup.schema'
import { User } from '~Users/schemas/users.schema'

interface IPolicyHandler {
  handle(ability: AppAbility): boolean
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export type Subjects = InferSubjects<typeof User | typeof Meetup> | User | Meetup | Role.ALL

export type AppAbility = Ability<[AbilityAction, Subjects]>
