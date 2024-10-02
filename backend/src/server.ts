import fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes/routes';
import { FindAllUsers } from './routes/users/find-all-users';
import { knex } from './database';
export const app = fastify();

// Rota para a raiz
app.get('/', async (request, reply) => {
  return { message: 'Bem-vindo ao PassMinders API!' };
});

// Registrar outras rotas
app.register(routes);
app.register(cors, {});

async function testDbConnection() {
    try {
      const result = await knex.raw('SELECT 1+1 AS result');
      console.log('Conexão ao banco de dados está OK:', result);
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
  }
  
  testDbConnection();

app.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.log(err);
  }

  console.log('Servidor rodando em http://localhost:5000');
});
