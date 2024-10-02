import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { knex } from '../../database';
import { ZodError } from 'zod';
import { z } from 'zod';

export const AuthUser = async (app: FastifyInstance) => {
  app.post('/authUser', async (request, reply) => {
    try {
      // Definir o esquema de validação para o login
      const LoginSchema = z.object({
        emailOrUsername: z.string(), // Pode ser o nome de usuário ou email
        senha: z.string()
      });

      // Validar a entrada do usuário
      const loginData = LoginSchema.parse(request.body);

      // Procurar o usuário pelo email ou nome de usuário
      const user = await knex('Usuario')
        .where('email', loginData.emailOrUsername)
        .orWhere('nomeUsuario', loginData.emailOrUsername)
        .first(); // Pegar o primeiro resultado

      // Se o usuário não for encontrado
      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' });
      }

      // Verificar se a senha corresponde
      if (user.senha !== loginData.senha) {
        return reply.status(401).send({ message: 'Senha incorreta' });
      }

      // Retornar sucesso se a autenticação for bem-sucedida
      return reply.status(200).send({ message: 'Login bem-sucedido', user });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ error: error.errors || 'Erro ao validar login' });
      } else {
        return reply.status(500).send({ message: 'Erro interno do servidor', error });
      }
    }
  });
};
