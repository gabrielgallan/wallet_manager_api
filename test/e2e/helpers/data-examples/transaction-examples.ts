import * as types from "@/@types/app-types.ts"

export const IncomeTransactionBodyExample: types.TransactionBodyType = {
    title: "Pagamento Bolsa Estágio",
    type: "pix",
    amount: 1800.00,
    category: "Salário",
    operation: "income"
}

export const ExpenseTransactionBodyExample: types.TransactionBodyType = {
    title: "McDonalds",
    type: "debit",
    amount: 65.50,
    category: "Alimentação",
    operation: "expense"
}