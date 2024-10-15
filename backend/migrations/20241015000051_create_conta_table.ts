import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Conta', (table) => {
    table.increments('id').primary();
    table.string('titulo', 50);
    table.string('foto_referencia', 255);
    table.integer('id_pasta').unsigned().references('id').inTable('Pasta').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('Conta');
}
