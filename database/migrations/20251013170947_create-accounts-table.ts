import type { Knex } from "knex"


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('accounts', (table) => {
        table.uuid('id').primary().notNullable()
        table.uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')

        table.string('holder', 255).notNullable()
        table.string('type').defaultTo('Corrente')
        table.decimal('balance', 14, 2).notNullable()
        table.timestamp('updated_at')
        table.timestamp('created_at').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('accounts')
}

