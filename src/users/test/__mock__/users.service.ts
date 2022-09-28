import { IExtendedRequest } from '~/interfaces/extendedRequest'

import userStub from '../stubs/users.stub'

export const UserService = jest.fn().mockReturnValue({
  getAllUsers: jest.fn().mockResolvedValue([userStub()]),
  getUserById: jest.fn().mockResolvedValue(userStub()),
  updateUser: jest.fn().mockResolvedValue(userStub()),
  removeUser: jest.fn().mockResolvedValue(userStub()),
  removeAllUsers: jest.fn().mockResolvedValue(userStub()),
})

export const requestMock = {
  user: {
    id: '6307c6f8d6013aad1a721c86',
    name: 'TestName',
    role: 'user',
  },
  cookies: {
    'auth-cookie': {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzA3YzZmOGQ2MDEzYWFkMWE3MjFjODYiLCJ1c2VybmFtZSI6InRlc3QiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjE2ODg3MjksImV4cCI6MTY2MTY4OTYyOX0.kAvtMzMm1ZIyrikH0W6HBFPa35O3PAX7kQZKG-AjIxI',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzA3YzZmOGQ2MDEzYWFkMWE3MjFjODYiLCJ1c2VybmFtZSI6InRlc3QiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjE2ODg3MjksImV4cCI6MTY2MTY4OTYyOX0.kAvtMzMm1ZIyrikH0W6HBFPa35O3PAX7kQZKG-AjIxI',
    },
  },
} as unknown as IExtendedRequest
