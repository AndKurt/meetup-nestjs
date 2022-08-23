import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateMeetupDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  readonly title: string

  @IsString()
  @MaxLength(100)
  @IsOptional()
  readonly description: string

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  readonly tags: string[]

  @IsString()
  @MaxLength(50)
  @IsOptional()
  readonly place: string

  @IsDateString()
  @IsOptional()
  readonly date: Date
}
