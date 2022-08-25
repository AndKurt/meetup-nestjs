export interface IUserDetails {
  id: string
  name: string
  email: string
  refreshToken?: string
}

export interface ICreateUser {
  name: string
  email: string
  password: string
}
