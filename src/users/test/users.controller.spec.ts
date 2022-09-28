// eslint-disable-next-line max-classes-per-file
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Meetup } from '~/meetup/schemas/meetup.schema'
import PermissionAbilityFactory from '~Ability/ability.factory'

import { IUserDetails } from '../interface'
import { User } from '../schemas/users.schema'
import UsersController from '../users.controller'
import UsersService from '../users.service'
import userStub from './stubs/users.stub'

// jest.mock('../users.service')

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
          useFactory: () => ({
            find: jest.fn().mockResolvedValue([userStub()]),
          }),
        },
        {
          provide: getModelToken(Meetup.name),
          useValue: {},
        },

        PermissionAbilityFactory,
      ],
    }).compile()

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
        // expect(usersService.getAllUsers).toHaveBeenCalled()
      })

      test('then is should return array of users', () => {
        const mockUser = userStub()
        expect(users).toEqual([{ id: mockUser._id, email: mockUser.email, name: mockUser.name, role: mockUser.role }])
      })
    })
  })
})

// import { getModelToken } from '@nestjs/mongoose'
// import { Test, TestingModule } from '@nestjs/testing'
// import { MongoMemoryServer } from 'mongodb-memory-server'
// import { Connection, connect, Model } from 'mongoose'

// import PermissionAbilityFactory from '~/ability/ability.factory'

// import { User, UserSchema } from '../schemas/users.schema'
// import UsersController from '../users.controller'
// import UsersService from '../users.service'
// import userStub from './stubs/users.stub'

// describe('UserController', () => {
//  let usersController: UsersController
//  let mongod: MongoMemoryServer
//  let mongoConnection: Connection
//  let userModel: Model<User>

//  beforeAll(async () => {
//    mongod = await MongoMemoryServer.create()
//    const uri = mongod.getUri()
//    mongoConnection = (await connect(uri)).connection
//    userModel = mongoConnection.model(User.name, UserSchema)

//    const moduleRef: TestingModule = await Test.createTestingModule({
//      controllers: [UsersController],
//      providers: [UsersService, PermissionAbilityFactory, { provide: getModelToken(User.name), useValue: userModel }],
//    }).compile()

//    usersController = moduleRef.get<UsersController>(UsersController)
//  })

//  afterAll(async () => {
//    await mongoConnection.dropDatabase()
//    await mongoConnection.close()
//    await mongod.stop()
//  })

//  afterEach(async () => {
//    jest.useRealTimers()
//    const collections = mongoConnection
//    // eslint-disable-next-line no-restricted-syntax, guard-for-in
//    for (const key in collections) {
//      const collection = collections[key]
//      // eslint-disable-next-line no-await-in-loop
//      await collection.deleteMany({})
//    }
//  })
//  describe('xxx', () => {
//    it('should be defined UsersController', () => {
//      expect(usersController).toBeDefined()
//    })

//    it('calling getAllUsers ', async () => {
//      // eslint-disable-next-line new-cap
//      await new userModel(userStub()).save()
//      const users = await usersController.getAllUsers()
//      expect(users).toBe([userStub()])
//    })
//  })
// })

// const UserServiceProvider = {
//  provide: UsersService,
//  useFactory: () => ({
//    getAllUsers: jest.fn(() => []),
//    getUserById: jest.fn(() => {}),
//    updateUser: jest.fn(() => {}),
//    removeUser: jest.fn(() => {}),
//    removeAllUsers: jest.fn(() => {}),
//    // getAllUsers: jest.fn().mockResolvedValue([userStub()]),
//    // getUserById: jest.fn().mockResolvedValue(userStub()),
//    // updateUser: jest.fn().mockResolvedValue(userStub()),
//    // removeUser: jest.fn().mockResolvedValue(userStub()),
//    // removeAllUsers: jest.fn().mockResolvedValue(userStub()),
//  }),
// }
