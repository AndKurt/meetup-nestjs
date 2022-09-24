import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Meetup, MeetupDocument } from 'src/meetup/schemas/meetup.schema'
import { User, UserDocument } from 'src/users/schemas/users.schema'

import { AppAbility, Subjects } from '~Ability/interface'
import { Role, AbilityAction } from '~Constants/ability'
import { UserSession } from '~Users/interface'

@Injectable()
export default class PermissionAbilityFactory {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Meetup.name) private meetupModel: Model<MeetupDocument>,
  ) {}

  createForUser(user: UserSession) {
    const { can, build } = new AbilityBuilder<Ability<[AbilityAction, Subjects]>>(Ability as AbilityClass<AppAbility>)

    if (user.role === Role.ADMIN) {
      can(AbilityAction.Manage, Role.ALL)
    }
    if (user.role === Role.USER) {
      can(AbilityAction.Read, Role.ALL)
      can(AbilityAction.Update, this.userModel, { _id: { $eq: user.id } })
      can(AbilityAction.Delete, this.userModel, { _id: { $eq: user.id } })

      can(AbilityAction.Update, this.meetupModel, { ownerId: { $eq: user.id } })
      can(AbilityAction.Delete, this.meetupModel, { ownerId: { $eq: user.id } })
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
