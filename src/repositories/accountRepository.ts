import { AccountType } from '../@types/app-types.ts'
import db from 'root/knexconfig.ts'
import { HttpError } from '../utils/helpers.ts'

class AccountRepository {
  async insert(account: AccountType): Promise<AccountType> {
    try {
      const [newAccount] = await db('accounts').insert(account).returning('*')

      return newAccount
    } catch (err: any) {
      throw new Error(`Failed to insert account in database: ${err.message}`)
    }
  }

  async findByUserId(user_id: string): Promise<AccountType> {
    const account = await db('accounts').select('*').where({ user_id }).first()

    if (!account) throw new HttpError(404, 'Account not found')

    return account
  }

  async listCategoriesByUserId(user_id: string): Promise<string[]> {
    const accountCategories = await db('accounts')
      .select('transaction_categories')
      .where({ user_id })
      .first()

    if (!accountCategories) throw new HttpError(404, 'Account not found')

    return accountCategories.transaction_categories
  }

  async update(
    id: string,
    data: Partial<AccountType> | AccountType,
  ): Promise<AccountType> {
    try {
      const [updatedAccount] = await db('accounts')
        .where({ id })
        .update(data)
        .returning('*')

      return updatedAccount
    } catch (err: any) {
      throw new Error(`Failed to update account: ${err.message}`)
    }
  }

  async updateCategories(user_id: string, category_name: string) {
    const [updatedAccount] = await db('accounts')
      .where({ user_id })
      .update({
        transaction_categories: db.raw(`array_append(transaction_categories, ?)`,
          [category_name])
      })
      .returning('*')

      return updatedAccount
  }
}

// exportando instância já pronta
export const accountRepository = new AccountRepository()