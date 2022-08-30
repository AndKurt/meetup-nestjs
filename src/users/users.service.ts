import { ConflictException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Role } from 'src/ability/ability.factory'

import { USER_REPOSITORY } from 'src/constants'
import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './schemas/users.schema-postgresql'

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userModel: typeof User) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async getAllUsers(): Promise<User[] | []> {
    const users = await this.userModel.findAll()
    if (!users.length) return []
    return users
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { email } })
  }

  async findByName(name: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { name } })
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { id } })
  }

  async create(data: CreateUserDto): Promise<User> {
    const { email, name } = data

    const userWithSameName = await this.findByName(name)
    const userWithSameEmail = await this.findByEmail(email)

    if (userWithSameName) {
      throw new ConflictException(`Account with name: ${userWithSameName.name} already exists!`)
    }
    if (userWithSameEmail) {
      throw new ConflictException(`Account with email: ${userWithSameEmail.email} already exists!`)
    }

    const newUser = await this.userModel.create<User>(data)
    return newUser.save()
  }

  async remove(id: string): Promise<User> {
    const user = await this.findById(id)

    if (!user) {
      throw new ConflictException(`Account with ID: ${id} doesn't exist!`)
    }
    await this.userModel.destroy({ where: { id } })
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return await this.userModel.update(updateUserDto, { where: { id: id } })
  }

  async removeAll() {
    // Delete all users except users with role admin
    return await this.userModel.destroy({ where: { role: Role.USER } })
  }
}
