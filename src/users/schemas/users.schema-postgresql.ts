import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string

  @Column({
    allowNull: true,
  })
  refreshToken?: string | null

  @Column({
    type: DataType.STRING,
  })
  role: string
}
