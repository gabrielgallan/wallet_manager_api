import { z } from 'zod'
import * as schemas from '../middlewares/pre-validation/zod-schemas.ts'
import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpResponse } from '../utils/helpers.ts'

// Class Types
export type UserType = {
  id: string
  name: string
  age: number
  cpf: string
  email: string
  password: string
  created_at: string
}

export type AccountType = {
  id: string
  user_id: string
  holder: string
  balance: number
  type: string | null
  updated_at: string
  created_at: string
  transaction_categories: string[]
}

export type TransactionType = {
  id: string
  account_id: string
  title: string
  category: string
  amount: number
  type: 'pix' | 'credit' | 'debit'
  operation: 'income' | 'expense'
  created_at: string
}

export type AppServicesFunction = (
  request: FastifyRequest,
) => Promise<HttpResponse>

export type AppPreValidations = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>

export type AppBodyTypes =
  | UserBodyType
  | UserUpdateBodyType
  | TransactionBodyType
  | UpdateCategoriesBodyType
  | {}

export type AppParamsTypes = UuidParamType | {}

export type AppQueryTypes = TransactionQueryType | {}

// Body Types
export type UserBodyType = z.infer<typeof schemas.UserBodySchema>

export type UserUpdateBodyType = z.infer<typeof schemas.UserUpdateBodySchema>

export type TransactionBodyType = z.infer<typeof schemas.TransactionBodySchema>

export type UpdateCategoriesBodyType = z.infer<typeof schemas.UpdateCategoriesBodySchema >

// Param Types
export type UuidParamType = z.infer<typeof schemas.UuidSchema>

// Query Types
export type TransactionQueryType = z.infer<
  typeof schemas.TransactionQuerySchema
>

export type OperationSumarry = {
  account: Pick<AccountType, 'holder' | 'balance'>
  transaction: Pick<
    TransactionType,
    'id' | 'title' | 'amount' | 'type' | 'created_at'
  >
}
