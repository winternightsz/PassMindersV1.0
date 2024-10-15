import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { knex } from '../../database';
import { z } from 'zod';
import { Folder } from '../../models/Folders';
import { Account } from '../../models/Account';
import { ItemConta } from '../../models/ItemConta';

export const CreateFolder = async (app: FastifyInstance) => {
    app.post('/createFolder', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // valida os dados pro schema
            const FolderSchema = z.object({
                nome: z.string().min(1, "O nome da pasta é obrigatório."),
                accounts: z.array(
                    z.object({
                        titulo: z.string().min(1, "O título da conta é obrigatório."),
                        foto_referencia: z.string().optional(),
                        dados: z.array(
                            z.object({
                                label: z.string(),
                                value: z.string(),
                            })
                        ),
                    })
                ).optional(),
            });

            // faz parse e validacao dos dados da requisicao
            const folderData = FolderSchema.parse(request.body);

            // verifica se uma pasta com o mesmo nome ja existe
            const existingFolder = await knex<Folder>('Pasta').where({ nome: folderData.nome }).first();
            if (existingFolder) {
                return reply.status(400).send({ error: 'Uma pasta com este nome já existe' });
            }

            // cria a pasta
            const [createdFolderId] = await knex<Folder>('Pasta').insert({
                nome: folderData.nome,
            });

            // insere as contas associadas se tiver
            if (folderData.accounts && folderData.accounts.length > 0) {
                for (const account of folderData.accounts) {
                    // cria cada conta associada a pasta
                    const [createdAccountId] = await knex<Account>('Conta').insert({
                        titulo: account.titulo,
                        foto_referencia: account.foto_referencia,
                        id_pasta: createdFolderId, // vai relacionar a pasta criada pegando o id da pasta
                    });

                    // insere os itens na tabela ItemConta que ja vieram la do front
                    for (const item of account.dados) {
                        await knex<ItemConta>('ItemConta').insert({
                            rotulo: item.label,
                            dado: item.value,
                            id_conta: createdAccountId, // relaciona com a conta
                        });
                    }
                }
            }
            
            // retorna a pasta criada com seus detalhes e o id pra poder dar um refresh no front
            const pastaCriada = await knex<Folder>('Pasta').where({ id: createdFolderId }).first();
            return reply.status(201).send(pastaCriada);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: error.errors });
            }
            console.error('Erro ao criar pasta:', error);
            return reply.status(500).send({ error: 'Erro ao criar pasta' });
        }
    });
};
