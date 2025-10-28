import { expect } from 'vitest'
import db from 'root/knexconfig.ts'

export async function CheckDatabasesLength(tablesArray: string[], lengths: number[]) {
    for (const i in tablesArray) {
        const rows = await db(tablesArray[i]).select('*')
        expect(rows.length).toEqual(lengths[i])
    }
}