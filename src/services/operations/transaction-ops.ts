import { randomUUID } from 'crypto'
import * as types from '@/@types/app-types.ts'
import { CreateTimestampZ } from '@/utils/helpers.ts'
import { Account } from './account-ops.ts'

export const Transaction = {
  CreateAtributes(
    transactionBody: types.TransactionBodyType,
    account: types.AccountType,
  ): types.TransactionType {
    const { title, category, amount, type, operation } = transactionBody
    const { id } = account
    return {
      id: randomUUID(),
      account_id: id,
      title,
      category,
      amount,
      type,
      operation,
      created_at: CreateTimestampZ(),
    }
  },

  CreateOperation(
    transaction: types.TransactionType,
    account: types.AccountType,
  ): [types.AccountType, types.TransactionType, types.OperationSumarry] {
    let accountUpdated
    try {
      if (transaction.operation === 'income') {
        accountUpdated = Account.Deposit(account, transaction.amount)
      } else {
        accountUpdated = Account.Withdraw(account, transaction.amount)
      }
    } catch (err) {
      throw err
    }

    const summary = CreateTransactionOperationSummary(
      accountUpdated,
      transaction,
    )

    return [accountUpdated, transaction, summary]
  },
}

function CreateTransactionOperationSummary(
  accountData: types.AccountType,
  transactionData: types.TransactionType,
): types.OperationSumarry {
  const { holder, balance } = accountData
  const { id, title, amount, type, created_at } = transactionData
  return {
    account: { holder, balance },
    transaction: { id, title, amount, type, created_at },
  }
}
