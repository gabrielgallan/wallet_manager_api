import knex, { Knex } from 'knex'

import { env } from './env/config.ts'

const connection =
  env.DATABASE_CLIENT === 'sqlite'
    ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL

const pool =
  env.DATABASE_CLIENT === 'sqlite'
    ? {
        afterCreate: (conn: any, done: any) => {
          conn.run('PRAGMA foreign_keys = ON', done)
        },
      }
    : {}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
  pool,
}

const db = knex(config)

export default db
