import { HttpError, HttpResponse } from '../utils/helpers.ts'
import { userRepository } from '@/repositories/userRepository.ts'
import * as types from '@/@types/app-types.ts'
import { FastifyRequest } from 'fastify'
import { User } from './operations/user-ops.ts'
import { accountRepository } from '@/repositories/accountRepository.ts'
import bcrypt from 'bcryptjs'

export async function createNewUserAccount(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const userBody = request.body as types.UserBodyType

    const userAtributes = User.CreateAtributes(userBody)

    const [_account, _user] = User.OpenAccount(userAtributes)

    const user = await userRepository.insert(_user)

    const account = await accountRepository.insert(_account)

    return new HttpResponse(201, { user })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function listUsers(): Promise<HttpResponse> {
  try {
    const users = await userRepository.selectAll()

    return new HttpResponse(200, { users })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function selectUserById(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType

    const user = await userRepository.findById(id)

    return new HttpResponse(200, { user })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function deleteUserById(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType
    await userRepository.delete(id)

    return new HttpResponse(200, { message: `User deleted: ${id}` })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function updateUser(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { auth, ...data } = request.body as types.UserUpdateBodyType
    const { id } = request.params as types.UuidParamType

    const user = await userRepository.findById(id)

    if (!User.ComparePass(user, auth))
      throw new HttpError(401, 'Incorrect password')

    if ('password' in data && typeof data.password === 'string') {
      data.password = bcrypt.hashSync(data.password, 10)
    }

    const updated = await userRepository.update(id, data)

    return new HttpResponse(200, { updated })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, `Failed to update user: ${err.message}`)
  }
}
