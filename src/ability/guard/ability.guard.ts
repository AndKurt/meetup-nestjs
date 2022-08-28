import { ForbiddenError } from '@casl/ability'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AppAbility, CaslAbilityFactory } from '../ability.factory'
import { CHECK_POLICIES_KEY, RequiredRule } from '../decorator/ability.decorator'
import { PolicyHandler } from '../interface'

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_POLICIES_KEY, context.getHandler()) || []

    const { user } = context.switchToHttp().getRequest()
    const ability = this.caslAbilityFactory.createForUser(user)

    try {
      rules.forEach((rule) => {
        console.log(rule.action, rule.subject)

        return ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject)
      })

      return true
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException()
      }
    }
    //return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability))
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
