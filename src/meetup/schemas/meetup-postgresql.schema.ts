import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from 'src/users/schemas/users.schema-postgresql'

@Table
export class Meetup extends Model<Meetup> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  tags: string[]

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  place: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId: number
}
