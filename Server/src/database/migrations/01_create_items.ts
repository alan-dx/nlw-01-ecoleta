import Knex from 'knex';//Com K maiusculo para pegar o tipo e não a função em si
//MIGRATION

//CRIA A TABELA ITEMS QUANDO REALIZAR O COMANDO npm run knex:migrate (srpit personalizado)

export async function up(knex: Knex) {//Tipar a variável garante um melhor uso da intelliSense da IDE
    return knex.schema.createTable('items', table => {//Cria uma tabela no banco de dados
        //Estrutura dos items da tabela
        table.increments('id').primary();//Identificador do item da tabela
        table.string('image').notNullable();//Elemento da tabela, salvo como string
        table.string('title').notNullable();//Elemento da tabela, salvo como string
    })
};

export async function down(knex: Knex) {
    //DELETAR A TABELA CRIADA (FAZ O CONTRÁRIO DA FUNÇÃO UP)
    return knex.schema.dropTable('items');
}