import { Role } from '~/constants/ability'

const userStub = () => ({
  _id: '6307c6f8d6013aad1a721c86',
  email: 'test@test.com',
  name: 'TestName',
  role: Role.USER,
})

export default userStub
