import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { User } from 'src/users/schemas/users.schema-postgresql'
import { InjectModel } from '@nestjs/sequelize'
import { Meetup } from 'src/meetup/schemas/meetup-postgresql.schema'

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
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Meetup) private meetupModel: typeof Meetup,
  ) {}
  createForUser(user: any) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all')
    }
    if (user.role === Role.USER) {
      can(Action.Read, 'all')
      can(Action.Update, this.userModel, { id: { $eq: user['sub'] } })
      can(Action.Delete, this.userModel, { id: { $eq: user['sub'] } })

      can(Action.Update, this.meetupModel, { ownerId: { $eq: user['sub'] } })
      can(Action.Delete, this.meetupModel, { ownerId: { $eq: user['sub'] } })
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
