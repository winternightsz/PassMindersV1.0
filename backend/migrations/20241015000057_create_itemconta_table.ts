import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ItemConta', (table) => {
    table.increments('id').primary();
    table.string('rotulo', 50);
    table.string('dado', 100);
    table.integer('id_conta').unsigned().references('id').inTable('Conta').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ItemConta');
}
