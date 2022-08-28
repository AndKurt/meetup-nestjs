import { SetMetadata } from '@nestjs/common'
import { Action, Subjects } from '../ability.factory'
import { PolicyHandler } from '../interface'

export interface RequiredRule {
  action: Action
  subject: Subjects
}

export const CHECK_POLICIES_KEY = 'check_policy'

export const CheckPolicies = (...handlers: RequiredRule[]) => SetMetadata(CHECK_POLICIES_KEY, handlers)
