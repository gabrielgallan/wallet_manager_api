import { expect } from 'vitest'
import request from 'supertest'
import app from '@/app.ts'
import { IncomeTransactionBodyExample } from '../data-examples/transaction-examples.ts'
import { TransactionBodyType } from '@/@types/app-types.ts'

export const TransactionServicesUtilities = {
    async create(user_id: string, body: TransactionBodyType) {
        const response = await request(app.server)
            .post(`/users/${user_id}/transactions`)
            .send(body)
            .expect(201)

        return response.body.data.operation.transaction
    },

    async consult(url: string){
        const response = await request(app.server)
            .get(url)
            .expect(200)

        return response.body.data.transactions
    },

    async consultExpectedError(url: string){
        const response = await request(app.server)
            .get(url)
            .expect(404)

        return response.body
    }
}