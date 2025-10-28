import { it, expect, describe, expectTypeOf } from 'vitest'
import { setupConfig } from './setup/setup-e2e.ts'
import { CheckDatabasesLength } from 'root/test/e2e/helpers/services-utilities/databases.ts'
import { UserServicesUtilities } from './helpers/services-utilities/users.ts'
import { AccountServicesUtilities } from './helpers/services-utilities/accounts.ts'
import { TransactionServicesUtilities } from './helpers/services-utilities/transactions.ts'
import { ExpenseTransactionBodyExample, IncomeTransactionBodyExample } from './helpers/data-examples/transaction-examples.ts'
import { randomUUID } from 'crypto'

describe('Transactions Consults Routes', () => {
    setupConfig()

    it('Create transactions and consult all', async () => {
        const returnedUser = await UserServicesUtilities.create()

        for (let c = 0; c < 5; c++) {
            await TransactionServicesUtilities.create(
                returnedUser.id,
                IncomeTransactionBodyExample
            )
        }

        await CheckDatabasesLength(['users', 'accounts', 'transactions'], [1, 1, 5])

        const userTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions`
        )

        expect(userTransactions.length).toBe(5)
    })

    it('Create transactions and consult by operations', async () => {
        const returnedUser = await UserServicesUtilities.create()

        const transaction1 = await TransactionServicesUtilities.create(
            returnedUser.id,
            IncomeTransactionBodyExample
        )

        const transaction2 = await TransactionServicesUtilities.create(
            returnedUser.id,
            ExpenseTransactionBodyExample
        )

        const transaction3 = await TransactionServicesUtilities.create(
            returnedUser.id,
            ExpenseTransactionBodyExample
        )

        //Database Check
        await CheckDatabasesLength(['users', 'accounts', 'transactions'], [1, 1, 3])

        const expenseTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?operation=expense`
        )

        const incomeTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?operation=income`
        )

        //transactions Check
        expect(expenseTransactions.length).toBe(2)
        expect(incomeTransactions.length).toBe(1)

        //Account Check
        const account = await AccountServicesUtilities.consult(returnedUser.id)

        const accountBalanceExpected = transaction1.amount - transaction2.amount - transaction3.amount

        expect(account.balance).toBe(accountBalanceExpected)
    })

    it('Create transactions and consult by payment types', async () => {
        const returnedUser = await UserServicesUtilities.create()

        const transaction1 = await TransactionServicesUtilities.create(
            returnedUser.id,
            IncomeTransactionBodyExample
        )

        const transaction2 = await TransactionServicesUtilities.create(
            returnedUser.id,
            {
                type: 'credit',
                title: 'Conta de luz',
                category: 'Moradia',
                amount: 150.50,
                operation: 'expense'
            }
        )

        const transaction3 = await TransactionServicesUtilities.create(
            returnedUser.id,
            {
                type: 'debit',
                title: 'Uber para festa',
                category: 'Transporte',
                amount: 48.50,
                operation: 'expense'
            }
        )

        await CheckDatabasesLength(['users', 'accounts', 'transactions'], [1, 1, 3])

        const pixTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?type=pix`
        )

        expect(pixTransactions.length).toBe(1)

        const debitTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?type=debit`
        )

        expect(debitTransactions.length).toBe(1)

        const creditTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?type=credit`
        )

        expect(creditTransactions.length).toBe(1)
    })

    it('Create transactions and consult by category', async () => {
        const returnedUser = await UserServicesUtilities.create()

        const transaction1 = await TransactionServicesUtilities.create(
            returnedUser.id,
            IncomeTransactionBodyExample
        )

        const transaction2 = await TransactionServicesUtilities.create(
            returnedUser.id,
            ExpenseTransactionBodyExample
        )

        const transaction3 = await TransactionServicesUtilities.create(
            returnedUser.id,
            ExpenseTransactionBodyExample
        )

        const transaction4 = await TransactionServicesUtilities.create(
            returnedUser.id,
            {
                type: 'debit',
                title: 'Uber para festa',
                category: 'Transporte',
                amount: 48.50,
                operation: 'expense'
            }
        )

        await CheckDatabasesLength(['users', 'accounts', 'transactions'], [1, 1, 4])

        const salaryTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?category=Salário`
        )

        expect(salaryTransactions.length).toBe(1)

        const alimentsTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?category=Alimentação`
        )

        expect(alimentsTransactions.length).toBe(2)

        const transportTransactions = await TransactionServicesUtilities.consult(
            `/users/${returnedUser.id}/transactions?category=Transporte`
        )

        expect(transportTransactions.length).toBe(1)
    })

    it.skip('Create transactions and consult by timestamp', async () => {
    })

    it("Search for transactions of a user doesn't exists", async () => {
        const fakeUuid = randomUUID()

        const transactions = await TransactionServicesUtilities.consultExpectedError(
            `/users/${fakeUuid}/transactions`
        )

        expect(transactions).toEqual({
            status: 'failed',
            error: 'Account not found'
        })
    })
})