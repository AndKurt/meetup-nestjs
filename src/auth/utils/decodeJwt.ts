import jwt_decod from 'jwt-decode'

export const getIdFromAccessToken = (token: string) => {
  const decodedToken = jwt_decod(token)
  const userId = decodedToken['sub']
  return userId
}
