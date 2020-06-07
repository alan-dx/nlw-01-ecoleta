import knex from 'knex';
import path from 'path';

//FAZENDO A CONEXÂO COM O BANCO DE DADOS

const connection = knex({
    client: 'sqlite3',//Indicando qual db será usado
    connection: {//Indicando qual será o arquivo do database
        filename:  path.resolve(__dirname, 'database.sqlite'),//path.resolve é utlizado para melhor compatibilidade de caminhos de diretórios para diferentes S.O., pois diferentes SO usam diferentes enderços de Diretórios
        //__dirname é uma variável global que recebe o endereço do arquivo indicado e o outro parâmetro é o nome do arquivo/caminho que se quer acessar
    },
    useNullAsDefault: true
});

export default connection;

//Migrations - Histórico do banco de dados, permitindo criar/editar novas tabelas com mais facilidade. O histórico armazena as formas como as tabelas do banco SQL foi criada