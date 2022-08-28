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

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Meetup.name) private meetupModel: Model<MeetupDocument>,
  ) {}
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<
        Ability<[Action, InferSubjects<typeof this.userModel | typeof this.meetupModel> | 'all']>
      >,
    )

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all')
    }
    if (user.role === Role.USER) {
      can(Action.Read, 'all')
      can(Action.Create, 'all')
      can(Action.Update, this.userModel, { _id: { $eq: user['sub'] } })
      can(Action.Delete, this.userModel, { _id: { $eq: user['sub'] } })

      can(Action.Update, this.meetupModel, { ownerId: { $eq: user['sub'] } })
      can(Action.Delete, this.meetupModel, { ownerId: { $eq: user['sub'] } })
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<InferSubjects<typeof this.userModel | typeof this.meetupModel> | 'all'>,
    })
  }
}
