import { Request } from '@nestjs/common'

import { UserSession } from '~/users/interface'

export interface IExtendedRequest extends Request {
  user: UserSession
}
