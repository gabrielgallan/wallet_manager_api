import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const isPostgres = knex.client.config.client === 'pg'

    await knex.schema.alterTable('accounts', (table) => {
        if (isPostgres) {
            // ✅ PostgreSQL (produção)
            table.specificType('transaction_categories', 'text[]')
                .notNullable()
                .defaultTo(knex.raw(`ARRAY['Não informada']`))
        } else {
            // 🧩 SQLite (desenvolvimento)
            table.text('transaction_categories')
                .notNullable()
                .defaultTo(JSON.stringify(['Não informada']))
        }

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('accounts', (table) => {
        table.dropColumn('transaction_categories')
    })
}

