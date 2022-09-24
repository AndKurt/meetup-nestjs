import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'

import { Role } from '~Constants/ability'

export default class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  readonly name: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  readonly password: string

  @IsOptional()
  readonly refreshToken?: string

  @IsNotEmpty()
  readonly role: Role = Role.USER
}
