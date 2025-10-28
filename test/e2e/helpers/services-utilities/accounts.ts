import { expect } from 'vitest'
import request from 'supertest'
import app from '@/app.ts'

export const AccountServicesUtilities = {
    async consult(user_id: string) {
        const response = await request(app.server)
            .get(`/users/${user_id}/accounts`)
            .expect(200)

        return response.body.data.account
    },

    async consultExpectError(id: string) {
        const response = await request(app.server)
            .get(`/users/${id}/accounts`)
            .expect(404)

        return response.body
    },

    async consultAnalytics(user_id: string) {
        const response = await request(app.server)
            .get(`/users/${user_id}/accounts/analytics`)
            .expect(200)

        return response.body
    }
}