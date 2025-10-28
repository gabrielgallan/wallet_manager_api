import { TransactionType } from "@/@types/app-types.ts"

export interface AnalyticsResponseType {
    analytics: {
        summaries: {
            current_month: {
                in: number | null
                out: number | null
                balance: number | null
            }
        }

        categories: {
            expenses_by_categories: any
            most_expensive: { category: string, total: number } | {}
            least_expensive: { category: string, total: number } | {}
        }

        mains: {
            expenses: {
                by_days: any,
                most_expensive_day: {
                    day: string, total: number | string
                }
                most_expensive_transaction: TransactionType
            }
            incomes: {
                by_days: any,
                highest_income_transaction: TransactionType
            } | {}
        }
    }
}