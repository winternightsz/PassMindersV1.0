import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { knex } from '../../database';
import { Folder } from '../../models/Folders';
import { Account } from '../../models/Account';
import { ItemConta } from '../../models/ItemConta';

export const FindAllFolders = async (app: FastifyInstance) => {
    app.get('/findFolders', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // Busca todas as pastas
            const folders = await knex<Folder>('Pasta').select('*');

            if (!folders || folders.length === 0) {
                return reply.status(404).send({ error: 'Nenhuma pasta encontrada.' });
            }

            // Para cada pasta, buscar as contas relacionadas
            const foldersWithAccountsAndItems = await Promise.all(
                folders.map(async (folder) => {
                    // Busca as contas relacionadas à pasta
                    const accounts = await knex<Account>('Conta').where({ id_pasta: folder.id });

                    // Para cada conta, buscar os itens (dados) relacionados
                    const accountsWithItems = await Promise.all(
                        accounts.map(async (account) => {
                            const items = await knex<ItemConta>('ItemConta').where({ id_conta: account.id });
                            return { ...account, dados: items }; // Adiciona os itens à conta
                        })
                    );

                    return { ...folder, contas: accountsWithItems }; // Adiciona as contas à pasta
                })
            );

            return reply.status(200).send(foldersWithAccountsAndItems);
        } catch (error) {
            console.error('Erro ao buscar pastas:', error);
            return reply.status(500).send({ error: 'Erro ao buscar pastas.' });
        }
    });
};
