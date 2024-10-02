import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/dev.sqlite3',
    },
    migrations: {
      directory: './migrations', // Caminho para suas migrations
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'passMinders',
    },
    migrations: {
      directory: './migrations', // Caminho para suas migrations
    },
  },
};

export default config;
