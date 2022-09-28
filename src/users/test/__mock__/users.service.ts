import userStub from '../stubs/users.stub'

const UserService = jest.fn().mockReturnValue({
  getAllUsers: jest.fn().mockResolvedValue([userStub()]),
  getUserById: jest.fn().mockResolvedValue(userStub()),
  updateUser: jest.fn().mockResolvedValue(userStub()),
  removeUser: jest.fn().mockResolvedValue(userStub()),
  removeAllUsers: jest.fn().mockResolvedValue(userStub()),
})

export default UserService
