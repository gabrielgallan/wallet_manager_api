import type { Knex } from 'knex'


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().notNullable()
        table.string('name', 255).notNullable()
        table.integer('age').notNullable()
        table.string('cpf', 11).notNullable().unique()
        table.string('email', 255).notNullable().unique()
        table.string('password', 255).notNullable()
        table.timestamp('created_at', { useTz: false }).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

