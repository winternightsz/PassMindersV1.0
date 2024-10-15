import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { knex } from '../../database';
import { z } from 'zod';
import { Folder } from '../../models/Folders';
import { Account } from '../../models/Account';
import { ItemConta } from '../../models/ItemConta';

export const CreateFolder = async (app: FastifyInstance) => {
    app.post('/createFolder', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // Validação dos dados de Folder, Account e ItemConta
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

            // Parse e validação dos dados da requisição
            const folderData = FolderSchema.parse(request.body);

            // Verifica se uma pasta com o mesmo nome já existe
            const existingFolder = await knex<Folder>('Pasta').where({ nome: folderData.nome }).first();
            if (existingFolder) {
                return reply.status(400).send({ error: 'Uma pasta com este nome já existe' });
            }

            // Cria a pasta
            const [createdFolderId] = await knex<Folder>('Pasta').insert({
                nome: folderData.nome,
            });

            // Insere as contas associadas, se houver
            if (folderData.accounts && folderData.accounts.length > 0) {
                for (const account of folderData.accounts) {
                    // Cria cada conta associada à pasta
                    const [createdAccountId] = await knex<Account>('Conta').insert({
                        titulo: account.titulo,
                        foto_referencia: account.foto_referencia,
                        id_pasta: createdFolderId, // Relaciona a conta à pasta recém-criada
                    });

                    // Insere os itens de conta associados à conta
                    for (const item of account.dados) {
                        await knex<ItemConta>('ItemConta').insert({
                            rotulo: item.label,
                            dado: item.value,
                            id_conta: createdAccountId, // Relaciona os itens à conta recém-criada
                        });
                    }
                }
            }
            
            // Retorna a pasta criada com seus detalhes
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
