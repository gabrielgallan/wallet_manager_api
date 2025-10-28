import { TransactionType } from "@/@types/app-types.ts"
import { transactionRepository } from "@/repositories/transactionRepository.ts"
import { CreateCurrentMonthTimestamp, ParseToMoney, CreateCurrentWeekTimestamp } from "@/utils/helpers.ts"


export const Analytics = {
    async CreateCurrentSummary(account_id: string) {
        let inMonthValue = null
        let outMonthValue = null
        let balance = null

        const [start_time, end_time] = CreateCurrentMonthTimestamp()

        const [inMonthTransactions, outMonthTransactions] = await GetTransactionsCategoryzed(
            account_id, start_time, end_time
        )

        if (inMonthTransactions.length >= 1) {
            inMonthValue = SumTransactions(inMonthTransactions)

        }

        if (outMonthTransactions.length >= 1) {
            outMonthValue = SumTransactions(outMonthTransactions)
        }

        if (outMonthValue && inMonthValue) {
            balance = inMonthValue - outMonthValue
        }



        const current_month = {
            in: inMonthValue,
            out: outMonthValue,
            balance,
        }

        return { current_month }
    },

    async CreateCategorySummary(account_id: string) {
        const [start_time, end_time] = CreateCurrentMonthTimestamp()
        const transactions = await transactionRepository.selectByQuery(account_id, { start_time, end_time, operation: 'expense' })
        
        if (transactions.length === 0) return {
            expenses_by_categories: {},
            most_expensive: {},
            least_expensive: {}
        }
        
        const totalExpenses = SumTransactions(transactions)

        const transactionsCategorized = transactions.map(t => {
            return {
                category: t.category,
                amount: t.amount
            }
        })

        const expenses = transactionsCategorized.reduce((ac, at) => {
            const category = at.category
            const amount = ParseToMoney(at.amount)

            if (!ac[category]) {
                ac[category] = {
                    total: amount,
                    percentage: Number(((amount / totalExpenses) * 100).toFixed(2))
                }
            } else {
                const newTotal = ac[category].total + amount

                ac[category] = {
                    total: newTotal,
                    percentage: Number(((newTotal / totalExpenses) * 100).toFixed(2))
                }
            }

            return ac
        }, {})

        let topCategory = null
        let highestTotal = -Infinity // menor valor possível, garante que qualquer número é maior

        let lowestCategory = null
        let lowestTotal = Infinity // maior valor possível, garante que qualquer número é menor

        for (const [category, data] of Object.entries(expenses)) {
            if (data.total > highestTotal) {
                highestTotal = data.total
                topCategory = category
            }

            if (data.total < lowestTotal) {
                lowestTotal = data.total
                lowestCategory = category
            }
        }

        return {
            expenses_by_categories: expenses,
            most_expensive: { category: topCategory, total: highestTotal },
            least_expensive: { category: lowestCategory, total: lowestTotal }
        }
    },

    async CreateMainsSummary(account_id: string) {
        let incomes = {}
        let expenses = {}

        const [start_time, end_time] = CreateCurrentMonthTimestamp()

        const [inMonthTransactions, outMonthTransactions] = await GetTransactionsCategoryzed(
            account_id, start_time, end_time
        )

        if (outMonthTransactions.length >= 1) {
            const expenseTransaction = outMonthTransactions.reduce((ac, at) => {
                if (ParseToMoney(at.amount) > ParseToMoney(ac.amount)) {
                    return at
                } else {
                    return ac
                }
            }, { amount: '0' })

            const expensesByDay = outMonthTransactions.reduce((acc, t) => {
                if (t.operation !== 'expense') return acc // ignora receitas

                const date = new Date(t.created_at)
                const day = date.toISOString().split('T')[0] // "2025-10-01"

                const amount = parseFloat(t.amount)

                if (!acc[day]) acc[day] = 0
                acc[day] += amount

                return acc
            }, {})

            const [mostExpensiveDay, highestTotal] = Object.entries(expensesByDay)
                .reduce(
                    (max, [day, total]) => total > max[1] ? [day, total] : max,
                    ["", 0]
                )
            
            expenses = {
                by_days: expensesByDay,
                most_expensive_day: { day: mostExpensiveDay, total: highestTotal },
                most_expensive_transaction: expenseTransaction
            }
        }

        if (inMonthTransactions.length >= 1) {
            const highestIncomeTransaction = inMonthTransactions.reduce((ac, at) => {
                if (ParseToMoney(at.amount) > ParseToMoney(ac.amount)) {
                    return at
                } else {
                    return ac
                }
            }, { amount: '0' })

            const incomesByDay = inMonthTransactions.reduce((acc, t) => {
                const date = new Date(t.created_at)
                const day = date.toISOString().split('T')[0] // "2025-10-01"

                const amount = parseFloat(t.amount)

                if (!acc[day]) acc[day] = 0
                acc[day] += amount

                return acc
            }, {})

            incomes = {
                by_days: incomesByDay,
                highest_income_transaction: highestIncomeTransaction
            }
        }

        return {
            expenses, incomes
        }
    }
}






function SumTransactions(transactions: TransactionType[]) {
    return transactions.length === 0 ? 0 :
        transactions
            .map(t => t.amount)
            .reduce((ac, at) => ParseToMoney(ac) + ParseToMoney(at))
}

async function GetTransactionsCategoryzed(
    account_id: string,
    start_time: string,
    end_time: string): Promise<[TransactionType[], TransactionType[]]> {

    const incomeTransactions = await transactionRepository.selectByQuery(
        account_id, {
        start_time,
        end_time,
        operation: 'income'
    }
    )

    const expenseTransactions = await transactionRepository.selectByQuery(
        account_id, {
        start_time,
        end_time,
        operation: 'expense'
    }
    )

    return [incomeTransactions, expenseTransactions]
}