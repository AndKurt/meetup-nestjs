import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CaslModule } from 'src/ability/ability.module'
import { RolesGuard } from 'src/auth/guards'

import { User, UserSchema } from './schemas/users.schema'
import { UserController } from './users.controller'
import { UserService } from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), CaslModule],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService],
})
export class UserModule {}
