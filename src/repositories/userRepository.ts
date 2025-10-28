import { UserType } from '../@types/app-types.ts'
import db from '../../knexconfig.ts'
import { HttpError } from '../utils/helpers.ts'
import { env } from 'root/env/config.ts'

class UserRepository {
  async selectAll(): Promise<UserType[]> {
    const users = await db('users').select('*')
    return users
  }

  async insert(user: UserType): Promise<UserType> {
    try {
      const [newUser] = await db('users').insert(user).returning('*')

      return newUser
    } catch (err: any) {
      throw QueryErrorController(err)
    }
  }

  async findById(id: string): Promise<UserType> {
    const user = await db('users').select('*').where({ id }).first()

    if (!user) throw new HttpError(404, 'User not found')

    return user
  }

  async update(
    id: string,
    data: Partial<UserType> | UserType,
  ): Promise<UserType> {
    try {
      const [updatedUser] = await db('users')
        .where({ id })
        .update(data)
        .returning('*')

      return updatedUser
    } catch (err: any) {
      throw QueryErrorController(err)
    }
  }

  async delete(id: string): Promise<void> {
    const rowsDeleted = await db('users').where({ id }).del()

    if (!(rowsDeleted > 0)) throw new Error('Unknown error')
  }
}

function QueryErrorController(err: any): HttpError | Error {
  if (err.code === 'SQLITE_CONSTRAINT' || err.code === '23505') {
    // 23505 = Postgres unique violation
    return new HttpError(409, 'Email ou CPF já cadastrado')
  }
  return new Error(err.message)
}

export const userRepository = new UserRepository()
