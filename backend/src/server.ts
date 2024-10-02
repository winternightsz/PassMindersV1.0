import fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes/routes';

export const app = fastify();

// Rota para a raiz
app.get('/', async (request, reply) => {
  return { message: 'Bem-vindo ao PassMinders API!' };
});

// Registrar outras rotas
app.register(routes);
app.register(cors, {});

app.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.log(err);
  }

  console.log('Servidor rodando em http://localhost:5000');
});
