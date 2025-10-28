import { TransactionType, TransactionQueryType } from '../@types/app-types.ts'
import db from '../../knexconfig.ts'
import { HttpError } from '../utils/helpers.ts'

class TransactionRepository {
  async selectAll(): Promise<TransactionType[]> {
    const accounts = await db('transactions').select('*')
    return accounts
  }

  async insert(transaction: TransactionType): Promise<TransactionType> {
    try {
      const [newTransaction] = await db('transactions')
        .insert(transaction)
        .returning('*')

      return newTransaction
    } catch (err: any) {
      throw QueryErrorController(err)
    }
  }

  async findById(id: string): Promise<TransactionType> {
    const transaction = await db('transactions')
      .select('*')
      .where({ id })
      .first()

    if (!transaction) throw new HttpError(404, 'Transaction not found')

    return transaction
  }

  async selectByAccountId(account_id: string): Promise<TransactionType[]> {
    const transactions = await db('transactions')
      .select('*')
      .where({ account_id })

    return transactions
  }

  async selectByQuery(
    account_id: string,
    Query: TransactionQueryType,
  ): Promise<TransactionType[]> {
    const { start_time, end_time, operation, type, max_count, category } = Query
    const query = db('transactions').select('*').where({ account_id })

    if (start_time && end_time) query.andWhereBetween('created_at', [start_time, end_time])
    if (operation) query.andWhere({ operation })
    if (type) query.andWhere({ type })
    if (category) query.andWhere({ category })
    if (max_count) query.limit(max_count)

    query.orderBy('created_at', 'desc')

    const transactions = await query
    return transactions
  }

  async selectByCategories(
    account_id: string
  ): Promise<Pick<TransactionType, "category" | "amount">[]> {
    const transactions = await db('transactions')
        .select('category', 'amount')
        .where({ account_id })

    return transactions
  }
}

function QueryErrorController(err: any): HttpError {
  return new HttpError(500, `${err.message}`)
}

// exportando instância já pronta
export const transactionRepository = new TransactionRepository()
