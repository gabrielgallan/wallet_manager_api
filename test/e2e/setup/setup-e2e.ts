import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import app from '@/app.ts'
import db from 'root/knexconfig.ts'

export const setupConfig = () => {
    beforeAll(async () => {
        await app.ready()
        await db.migrate.latest()
    })

    beforeEach(async () => {
        await db('users').del()
        await db('accounts').del()
        await db('transactions').del()
    })

    afterAll(async () => {
        await app.close()
        await db.migrate.rollback()
    })
}