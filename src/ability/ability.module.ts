import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Meetup } from 'src/meetup/schemas/meetup-postgresql.schema'
import { User } from 'src/users/schemas/users.schema-postgresql'
import { CaslAbilityFactory } from './ability.factory'

@Module({
  imports: [SequelizeModule.forFeature([User]), SequelizeModule.forFeature([Meetup])],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
