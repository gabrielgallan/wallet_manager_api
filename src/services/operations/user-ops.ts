import { randomUUID } from 'crypto'
import * as types from '@/@types/app-types.ts'
import * as helpers from '@/utils/helpers.ts'
import bcrypt from 'bcryptjs'

export const User = {
  CreateAtributes(userbody: types.UserBodyType): types.UserType {
    return {
      id: randomUUID(),
      ...userbody,
      password: bcrypt.hashSync(userbody.password, 10),
      created_at: helpers.CreateTimestampZ(),
    }
  },

  OpenAccount(userAtributes: types.UserType): [types.AccountType, types.UserType] {
    const account = {
      id: randomUUID(),
      user_id: userAtributes.id,
      holder: userAtributes.name,
      balance: helpers.ParseToMoney(0),
      type: 'Corrente',
      transaction_categories: helpers.DefaultTransactionCategories,
      updated_at: helpers.CreateTimestampZ(),
      created_at: helpers.CreateTimestampZ(),
    }

    return [account, userAtributes]
  },

  ComparePass(user: types.UserType, inputPass: string): boolean {
    return bcrypt.compareSync(inputPass, user.password)
  },
}
