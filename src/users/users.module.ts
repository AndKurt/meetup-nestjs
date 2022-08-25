import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesGuard } from 'src/auth/guards'

import { User, UserSchema } from './schemas/users.schema'
import { UserController } from './users.controller'
import { UserService } from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService],
})
export class UserModule {}
