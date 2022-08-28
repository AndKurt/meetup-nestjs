import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Meetup, MeetupDocument } from 'src/meetup/schemas/meetup.schema'
import { User, UserDocument } from 'src/users/schemas/users.schema'

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

//export type Subjects = InferSubjects<typeof User | typeof Meetup> | 'all'
export type Subjects = InferSubjects<typeof User | typeof Meetup> | User | Meetup | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Meetup.name) private meetupModel: Model<MeetupDocument>,
  ) {}
  createForUser(user: any) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all')
    }
    if (user.role === Role.USER) {
      can(Action.Read, 'all')
      can(Action.Update, this.userModel, { _id: { $eq: user['sub'] } })
      can(Action.Delete, this.userModel, { _id: { $eq: user['sub'] } })

      can(Action.Update, this.meetupModel, { ownerId: { $eq: user['sub'] } })
      can(Action.Delete, this.meetupModel, { ownerId: { $eq: user['sub'] } })
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
