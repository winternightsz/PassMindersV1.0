import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Usuario', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('nomeUsuario').notNullable();
    table.string('senha').notNullable();
    table.timestamps(true, true); // created_at e updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Usuario');
}
