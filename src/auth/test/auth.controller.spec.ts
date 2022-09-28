import { Test, TestingModule } from '@nestjs/testing'

import AuthController from '../auth.controller'
import AuthService from '../auth.service'
import { authResponseStub, loginAuthStub, requestMock, responseMock, userAuthStub } from './stubs/auth.stub'

const successLoginResponse = authResponseStub('Login successful', true)
const successRegisterResponse = authResponseStub('User created successful', true)
const successLogoutResponse = authResponseStub('Logout successful')
const successRefreshTokensResponse = authResponseStub('Refresh tokens successful', true)

describe('AuthController Unit Tests', () => {
  let authController: AuthController
  let spyService: AuthService

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        register: jest.fn().mockResolvedValue(successRegisterResponse),
        login: jest.fn().mockResolvedValue(successLoginResponse),
        logout: jest.fn().mockResolvedValue(successLogoutResponse),
        refreshTokens: jest.fn().mockResolvedValue(successRefreshTokensResponse),
      }),
    }
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ApiServiceProvider],
    }).compile()

    authController = app.get<AuthController>(AuthController)
    spyService = app.get<AuthService>(AuthService)
  })

  it('should be defined authController and AuthService', () => {
    expect(authController).toBeDefined()
    expect(spyService).toBeDefined()
  })

  it('calling login method', async () => {
    const loginData = loginAuthStub()
    const result = await authController.login(loginData, responseMock)
    expect(spyService.login).toHaveBeenCalledWith(loginData)
    expect(result).toEqual(successLoginResponse)
  })

  it('calling signup/register method', async () => {
    const createUserDtoData = userAuthStub()
    const result = await authController.signup(createUserDtoData, responseMock)
    expect(spyService.register).toHaveBeenCalledWith(createUserDtoData)
    expect(result).toEqual(successRegisterResponse)
  })

  it('calling logout method', () => {
    const result = authController.logout(requestMock)
    expect(spyService.logout).toHaveBeenCalledTimes(1)
    expect(result).toEqual(successLogoutResponse)
  })

  it('calling refresh tokens method', async () => {
    const result = await authController.refreshTokens(requestMock, responseMock)
    expect(spyService.refreshTokens).toHaveBeenCalledTimes(1)
    expect(result).toEqual(successRefreshTokensResponse)
  })
})
