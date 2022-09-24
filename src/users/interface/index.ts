export interface IUserDetails {
  id: string
  name: string
  email: string
  role: string
}

export type UserSession = Omit<IUserDetails, 'email'>
