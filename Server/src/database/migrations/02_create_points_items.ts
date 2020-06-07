import Knex from 'knex';//Com K maiusculo para pegar o tipo e não a função em si

//MIGRATION
//CRIA A TABELA POINT_ITEMS QUANDO REALIZAR O COMANDO npm run knex:migrate (srpit personalizado)

export async function up(knex: Knex) {//Tipar a variável garante um melhor uso da intelliSense da IDE
    return knex.schema.createTable('point_items', table => {//Cria uma tabela no banco de dados
        //Estrutura dos items da tabela
        table.increments('id').primary();//Identificador do item da tabela, integer por padrão

        table.integer('point_id')//Elemento da tabela, salvo como integer, se auto incrementa sozinho/gera uma chave automaticamente
            .notNullable()
            .references('id')//# leia o comentário da linha abaixo
            .inTable('points');//# point_id irá criar um chave estrangeira na outra tabela (points) no campo id, todo point_id aqui dentro tem que ser um id válido na tabela point

        table.integer('item_id')//Elemento da tabela, salvo como integer, se auto incrementa sozinho
            .notNullable()
            .references('id')//# leia o comentário da linha abaixo
            .inTable('items')//# item_id irá criar uma chave estrangeira na outra tabela (items) no campo id, todo item_id aqui dentro tem que ser um id válido na tabela items
    })
};

export async function down(knex: Knex) {
    //DELETAR A TABELA CRIADA (FAZ O CONTRÁRIO DA FUNÇÃO UP)
    return knex.schema.dropTable('point_items');
}