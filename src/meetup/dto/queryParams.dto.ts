import { IsNumberString, IsOptional, IsString } from 'class-validator'

export default class QueryParamsMeetup {
  @IsString()
  @IsOptional()
  readonly title: string

  @IsString()
  @IsOptional()
  readonly tag: string

  @IsNumberString()
  @IsOptional()
  readonly page: string

  @IsNumberString()
  @IsOptional()
  readonly countPerPage: string

  @IsString()
  @IsOptional()
  readonly sort: string
}
