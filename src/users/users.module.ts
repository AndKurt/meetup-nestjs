import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaslModule } from 'src/ability/ability.module'
import { usersProviders } from './providers/users.providers'
import { User } from './schemas/users.schema-postgresql'
import { UserController } from './users.controller'
import { UserService } from './users.service'

@Module({
  imports: [CaslModule, SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, ...usersProviders],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
