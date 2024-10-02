import { knex as setupKnex } from 'knex';

const isDevelopment = process.env.NODE_ENV === 'development';

export const knex = setupKnex({
  client: isDevelopment ? 'sqlite3' : 'mysql',
  connection: isDevelopment
    ? {
        filename: './data/dev.sqlite3',
      }
    : {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'passMinders',
      },
  useNullAsDefault: isDevelopment,
});
