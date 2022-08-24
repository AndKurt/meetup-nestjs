import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import * as bcrypt from 'bcrypt'

import { Model } from 'mongoose'
import { ICreateUser, IUserDetails } from './interface/user-details.interface'

import { User, UserDocument } from './schemas/users.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  getUserDetails(user: UserDocument): IUserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  }

  async getAllUsers(): Promise<IUserDetails[] | null> {
    const users = await this.userModel.find()
    if (!users.length) return []
    return users.map((user) => this.getUserDetails(user))
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async findByName(name: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ name }).exec()
  }

  async findById(id: string): Promise<IUserDetails | null> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new ConflictException(`Account with ID: ${id} doesn't exist!`)
    }
    return this.getUserDetails(user)
  }

  async create(data: ICreateUser): Promise<IUserDetails> {
    const { email, name, password } = data

    const userWithSameName = await this.findByName(name)
    const userWithSameEmail = await this.findByEmail(email)

    if (userWithSameName) {
      throw new ConflictException(`Account with name: ${userWithSameName.name} already exists!`)
    }
    if (userWithSameEmail) {
      throw new ConflictException(`Account with email: ${userWithSameEmail.email} already exists!`)
    }

    const hashedPassword = await this.hashPassword(password)

    const newUser = new this.userModel({ name, email, password: hashedPassword })
    newUser.save()
    return this.getUserDetails(newUser)
  }

  async remove(id: string): Promise<IUserDetails> {
    const user = await this.findById(id)
    if (!user) {
      throw new ConflictException(`Account with ID: ${id} doesn't exist!`)
    }
    await this.userModel.findByIdAndDelete(id)
    return user
  }
}
