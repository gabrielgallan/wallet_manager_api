import * as t from './app-types.ts'
import { Knex } from 'knex'

declare module 'knex/types/tables.ts' {
  interface Tables {
    users: t.UserType
    accounts: t.AccountType
    transactions: t.TransactionType
  }
}
