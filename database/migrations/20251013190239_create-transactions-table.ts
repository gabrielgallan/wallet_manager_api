import type { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary().notNullable()
        table.uuid('account_id')
            .notNullable()
            .references('id')
            .inTable('accounts')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            
        table.string('title', 255).notNullable()
        table.string('category', 255).notNullable()
        table.decimal('amount', 14, 2).notNullable()
        table.enu('type', ['credit', 'debit', 'pix']).notNullable()
        table.enu('operation', ['income', 'expense']).notNullable()
        table.timestamp('created_at').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

