import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class QueryParamsMeetup {
  @IsString()
  @IsOptional()
  readonly tag: string

  @IsNumberString()
  @IsOptional()
  readonly page: number

  @IsNumberString()
  @IsOptional()
  readonly countPerPage: number

  @IsString()
  @IsOptional()
  readonly sort: string
}
