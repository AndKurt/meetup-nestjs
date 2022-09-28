import { createMock } from '@golevelup/ts-jest'
import { Request, Response } from 'express'

import { AuthDto } from '~/auth/dto/auth.dto'
import { Role } from '~/constants/ability'
import { CreateUserDto } from '~/users/dto'

export const authResponseStub = (
  msg: 'User created successful' | 'Login successful' | 'Logout successful' | 'Refresh tokens successful',
  isToken = true,
) => {
  return {
    msg,
    ...(isToken ? { accessToken: undefined } : null),
  }
}

export const userAuthStub = (): CreateUserDto => ({
  name: 'TestName',
  email: 'test@test.com',
  password: 'testPassword',
  role: Role.USER,
})

export const loginAuthStub = (): AuthDto => ({
  name: 'TestName',
  password: 'testPassword',
})

const mockResponseObject = () => {
  return createMock<Response>({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  })
}

export const responseMock = mockResponseObject()
export const requestMock = {
  cookies: {
    'auth-cookie': {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzA3YzZmOGQ2MDEzYWFkMWE3MjFjODYiLCJ1c2VybmFtZSI6InRlc3QiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjE2ODg3MjksImV4cCI6MTY2MTY4OTYyOX0.kAvtMzMm1ZIyrikH0W6HBFPa35O3PAX7kQZKG-AjIxI',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzA3YzZmOGQ2MDEzYWFkMWE3MjFjODYiLCJ1c2VybmFtZSI6InRlc3QiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjE2ODg3MjksImV4cCI6MTY2MTY4OTYyOX0.kAvtMzMm1ZIyrikH0W6HBFPa35O3PAX7kQZKG-AjIxI',
    },
  },
} as unknown as Request
