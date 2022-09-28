// eslint-disable-next-line max-classes-per-file
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Meetup } from '~/meetup/schemas/meetup.schema'
import PermissionAbilityFactory from '~Ability/ability.factory'

import { IUserDetails } from '../interface'
import { User } from '../schemas/users.schema'
import UsersController from '../users.controller'
import UsersService from '../users.service'
import { requestMock } from './__mock__/users.service'
import userStub from './stubs/users.stub'

// jest.mock('../users.service')

const mockUser = userStub()

const mockUsersService = {
  getAllUsers: jest.fn(() => [userStub()]),
  findById: jest.fn(() => userStub()),
  update: jest.fn((dto) => ({ ...userStub(), ...dto })),
  removeAll: jest.fn(() => []),
}

describe('UsersController', () => {
  let usersController: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
        {
          provide: getModelToken(Meetup.name),
          useValue: {},
        },

        PermissionAbilityFactory,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile()

    usersController = moduleRef.get<UsersController>(UsersController)
    usersService = moduleRef.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  describe('getUsers', () => {
    describe('when getUsers is called', () => {
      let users: IUserDetails[]

      beforeEach(async () => {
        users = await usersController.getAllUsers()
      })

      test('then it should call usersService.getUsers', () => {
        expect(usersService.getAllUsers).toHaveBeenCalledTimes(1)
      })

      test('then is should return array of users', () => {
        expect(users).toEqual([{ id: mockUser._id, email: mockUser.email, name: mockUser.name, role: mockUser.role }])
      })
    })
  })

  describe('getUserById', () => {
    describe('when getUserById is called', () => {
      let user: IUserDetails

      beforeEach(async () => {
        user = await usersController.getUserById(mockUser._id)
      })

      test('then it should call usersService.findById with passed ID', () => {
        expect(usersService.findById).toHaveBeenCalledWith(mockUser._id)
      })

      test('then is should user', () => {
        expect(user).toEqual({ id: mockUser._id, email: mockUser.email, name: mockUser.name, role: mockUser.role })
      })
    })
  })

  describe('removeAllUsers', () => {
    describe('when removeAllUsers is called', () => {
      let msg: { [msg: string]: string }

      beforeEach(async () => {
        msg = await usersController.removeAllUsers(requestMock)
      })

      test('then it should call usersService.removeAllUsers', () => {
        expect(usersService.removeAll).toHaveBeenCalledTimes(1)
      })

      test('then is should updated user', () => {
        expect(msg).toEqual({ msg: 'All user deleted' })
      })
    })
  })
})
