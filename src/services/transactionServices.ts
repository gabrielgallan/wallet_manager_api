import { emptyObject, HttpError, HttpResponse } from '../utils/helpers.ts'
import { accountRepository } from '../repositories/accountRepository.ts'
import { transactionRepository } from '../repositories/transactionRepository.ts'
import * as types from '../@types/app-types.ts'
import { Transaction } from './operations/transaction-ops.ts'
import { FastifyRequest } from 'fastify'
import { env } from 'root/env/config.ts'

export async function createTransaction(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType
    const TBody = request.body as types.TransactionBodyType

    const account = await accountRepository.findByUserId(id)

    const transaction = Transaction.CreateAtributes(TBody, account)

    //Check Categories
    if (env.DATABASE_CLIENT === 'pg') {
      const accountCategories = await accountRepository.listCategoriesByUserId(id)
  
      if (!accountCategories.includes(TBody.category)) 
        throw new HttpError(404, 'O campo category não é compátivel com as categorias registradas!')
    }

    const [uptAccount, uptTransaction, operation] = Transaction.CreateOperation(
      transaction,
      account,
    )

    await accountRepository.update(uptAccount.id, uptAccount)

    await transactionRepository.insert(uptTransaction)

    return new HttpResponse(201, { operation })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function listUserTransactions(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType

    const account = await accountRepository.findByUserId(id)

    let transactions

    const query = request.query as types.TransactionQueryType

    if (emptyObject(query)) {
      transactions = await transactionRepository.selectByAccountId(account.id)
    } else {
      transactions = await transactionRepository.selectByQuery(
        account.id,
        query,
      )
    }

    return new HttpResponse(200, { transactions })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}
