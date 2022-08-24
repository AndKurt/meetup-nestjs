import { IsDateString, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class UserDto {
  @IsDateString() // TODO: Check the validate
  @IsNotEmpty()
  readonly userId: number

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  readonly username: string

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  readonly password: string
}
