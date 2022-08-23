import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new HttpExceptionFilter())

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
        console.log(errorMessages)
        return new BadRequestException(errorMessages)
      },
    }),
  )
  await app.listen(3333)
}
bootstrap()
