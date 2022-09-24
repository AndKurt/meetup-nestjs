import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import AppModule from '~/app.module'
import HttpExceptionFilter from '~Common/filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const errorMessages = {}
        errors.forEach((error) => {
          if (error.property !== 'name') {
            errorMessages[error.property] = Object.values(error.constraints).join('. ').trim()
          }
        })

        return new BadRequestException(errorMessages)
      },
    }),
  )
  await app.listen(3333)
}
bootstrap()
