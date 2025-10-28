import { AccountType } from '@/@types/app-types.ts'
import * as h from '@/utils/helpers.ts'

export const Account = {
  Deposit(account: AccountType, _value: number) {
    const [balance, value] = h.StringValuesToFloat([account.balance, _value])

    const newBalance = balance + value

    account.balance = h.ParseToMoney(newBalance)
    this.Update(account)
    return account
  },

  Withdraw(account: AccountType, _value: number) {
    const [balance, value] = h.StringValuesToFloat([account.balance, _value])

    if (value > balance) throw new Error('Não há saldo suficiente')

    const newBalance = balance - value

    account.balance = h.ParseToMoney(newBalance)
    this.Update(account)
    return account
  },

  Update(account: AccountType): void {
    account.updated_at = h.CreateTimestampZ()
  },
}