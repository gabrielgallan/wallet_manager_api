import { expect } from 'vitest'
import request from 'supertest'
import app from '@/app.ts'
import { UserBodyExample, UpdateUserBodyExample } from '../data-examples/user-examples.ts'

export const UserServicesUtilities = {
    async create() {
        const response = await request(app.server)
            .post('/users')
            .send(UserBodyExample)
            .expect(201)

        return response.body.data.user
    },

    async list() {
        const users = await request(app.server)
            .get('/users')
            .expect(200)

        return users.body.data
    },

    async consult(id: string) {
        const response = await request(app.server)
            .get(`/users/${id}`)
            .expect(200)

        return response.body.data.user
    },

    async update(id: string) {
        const response = await request(app.server)
            .put(`/users/${id}`)
            .send(UpdateUserBodyExample)
            .expect(200)

        return response.body.data.updated
    },

    async delete(id: string) {
        const response = await request(app.server)
            .delete(`/users/${id}`)
            .expect(200)

        return response.body
    },

    async consultExpectError(id: string) {
        const response = await request(app.server)
            .get(`/users/${id}`)
            .expect(404)

        return response.body
    }
}