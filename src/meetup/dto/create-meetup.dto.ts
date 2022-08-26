import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateMeetupDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly title: string

  @IsString()
  @MaxLength(100)
  @IsOptional()
  readonly description: string

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly tags: string[]

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly place: string

  @IsDateString()
  @IsNotEmpty()
  readonly date: Date

  @IsString()
  @IsOptional()
  readonly ownerId: string
}
