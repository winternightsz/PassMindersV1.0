import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Usuario');
  if (!exists) {
    return knex.schema.createTable('Usuario', (table) => {
      table.increments('id').primary();
      table.string('email', 100).notNullable().unique();
      table.string('nome_usuario', 30);
      table.string('senha', 30);
      table.string('foto_perfil', 255);
      table.boolean('conta_ativa');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Usuario');
}
