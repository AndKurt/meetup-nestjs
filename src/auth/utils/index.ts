import { Request } from 'express'
import jwt_decode from 'jwt-decode'

import { UserSession } from '~/users/interface'

export const getIdFromAccessToken = (token: string) => {
  const decodedToken: UserSession = jwt_decode(token)
  const userId = decodedToken.id

  return userId
}

export const extractToken =
  (key: 'accessToken' | 'refreshToken', cookieKey = 'auth-cookie') =>
  (request: Request) =>
    request?.cookies?.[cookieKey]?.[key]
