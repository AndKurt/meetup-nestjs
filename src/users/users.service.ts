import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Role } from '~Constants/ability'

import { CreateUserDto, UpdateUserDto } from './dto'
import { User, UserDocument } from './schemas/users.schema'

@Injectable()
export default class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async getAllUsers(): Promise<UserDocument[] | []> {
    const users = await this.userModel.find()
    if (!users.length) return []

    return users
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async findByName(name: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ name }).exec()
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id)
  }

  async findByIdForValidateToken(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec()
  }

  async create(data: CreateUserDto): Promise<UserDocument> {
    const { email, name, password, role } = data

    const userWithSameName = await this.findByName(name)
    const userWithSameEmail = await this.findByEmail(email)

    if (userWithSameName) {
      throw new ConflictException(`Account with name: ${userWithSameName.name} already exists!`)
    }
    if (userWithSameEmail) {
      throw new ConflictException(`Account with email: ${userWithSameEmail.email} already exists!`)
    }

    // eslint-disable-next-line new-cap
    const newUser = new this.userModel({ name, email, password, role })

    return newUser.save()
  }

  async remove(id: string): Promise<UserDocument> {
    const user = await this.findById(id)
    if (!user) {
      throw new ConflictException(`Account with ID: ${id} doesn't exist!`)
    }
    await this.userModel.findByIdAndDelete(id)

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec()
  }

  async removeAll() {
    return this.userModel.deleteMany({ role: { $ne: Role.ADMIN } })
  }
}
