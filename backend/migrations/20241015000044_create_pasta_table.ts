import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Pasta', (table) => {
    table.increments('id').primary();
    table.string('nome', 255);
    table.integer('id_usuario').unsigned().references('id').inTable('Usuario').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Pasta');
}
