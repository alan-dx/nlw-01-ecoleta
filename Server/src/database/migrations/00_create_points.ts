import Knex from 'knex';//Com K maiusculo para pegar o tipo e não a função em si
//MIGRATION
//CRIA A TABELA POINTS QUANDO REALIZAR O COMANDO npm run knex:migrate (scrpit personalizado);

export async function up(knex: Knex) {//Tipar a variável garante um melhor uso da intelliSense da IDE
    return knex.schema.createTable('points', table => {//Cria uma tabela no banco de dados
        //Estrutura dos items da tabela
        table.increments('id').primary();//Cria o identificador do item da tabela
        table.string('image').notNullable();//Cria o Elemento da tabela, salvo como string
        table.string('name').notNullable();//Cria o Elemento da tabela, salvo como string
        table.string('email').notNullable();//Cria o Elemento da tabela, salvo como string
        table.string('whatsapp').notNullable();//Cria o Elemento da tabela, salvo como string
        table.decimal('latitude').notNullable();//Cria o Elemento da tabela, salvo como decimal
        table.decimal('longitude').notNullable();//Cria o Elemento da tabela, salvo como decimal
        table.string('city').notNullable();//Cria o Elemento da tabela, salvo como string
        table.string('uf', 2).notNullable();//Cria o Elemento da tabela, salvo como string, o segundo parametro inddica o tamanho do campo
    })
};

export async function down(knex: Knex) {
    //DELETAR A TABELA CRIADA (FAZ O CONTRÁRIO DA FUNÇÃO UP)
    return knex.schema.dropTable('points')
}