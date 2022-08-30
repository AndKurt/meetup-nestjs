import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MeetupModule } from './meetup/meetup.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/users.module'
import { CaslModule } from './ability/ability.module'
import { User } from './users/schemas/users.schema-postgresql'
import { Meetup } from './meetup/schemas/meetup-postgresql.schema'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MeetupModule,
    UserModule,
    AuthModule,
    CaslModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRESQL_DB_HOST,
      port: +process.env.POSTGRESQL_DB_PORT,
      username: process.env.POSTGRESQL_DB_USER,
      password: process.env.POSTGRESQL_DB_PASS,
      database: process.env.POSTGRESQL_DB_NAME_TEST,
      autoLoadModels: true,
      models: [User, Meetup],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
