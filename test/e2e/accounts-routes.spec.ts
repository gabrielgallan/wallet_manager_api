import { it, expect, describe, expectTypeOf } from 'vitest'
import { setupConfig } from './setup/setup-e2e.ts'
import { CheckDatabasesLength } from 'root/test/e2e/helpers/services-utilities/databases.ts'
import { UserServicesUtilities } from './helpers/services-utilities/users.ts'
import { AccountServicesUtilities } from './helpers/services-utilities/accounts.ts'
import { TransactionServicesUtilities } from './helpers/services-utilities/transactions.ts'
import { ExpenseTransactionBodyExample, IncomeTransactionBodyExample } from './helpers/data-examples/transaction-examples.ts'

describe('Accounts Services Routes', () => {
    setupConfig()

    it('Consult account analytics after create transactions', async () => {
        const returnedUser = await UserServicesUtilities.create()

        const userTransactions = []

        for (let c = 0; c < 2; c++) {
            const t = await TransactionServicesUtilities.create(
                returnedUser.id,
                IncomeTransactionBodyExample
            )

            userTransactions.push(t)
        }

        for (let c = 0; c < 5; c++) {
            const t = await TransactionServicesUtilities.create(
                returnedUser.id,
                ExpenseTransactionBodyExample
            )

            userTransactions.push(t)
        }

        await CheckDatabasesLength(['users', 'accounts', 'transactions'], [1, 1, 7])

        const accountAnalytics = await AccountServicesUtilities.consultAnalytics(returnedUser.id)

        const { summaries, categories, mains } = accountAnalytics.data.analytics

        expect(summaries).toEqual({ current_month: { in: 3600, out: 327.5, balance: 3272.5 } })

        expect(categories).toEqual({
            expenses_by_categories: { 'Alimentação': { total: 327.5, percentage: 100 } },
            most_expensive: { category: 'Alimentação', total: 327.5 },
            least_expensive: { category: 'Alimentação', total: 327.5 }
        })

        expect(mains).toEqual({
            expenses: {
                by_days: expect.any(Object),
                most_expensive_day: expect.any(Object),
                most_expensive_transaction: expect.any(Object)
            },
            incomes: {
                by_days: expect.any(Object),
                highest_income_transaction: expect.any(Object)
            }
        })
    })
})