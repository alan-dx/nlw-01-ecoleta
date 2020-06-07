//Configurações da conexão com o Banco
import path from 'path';

module.exports = {//Não da pra usar export default ainda, knex não suporta no formato .ts
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'), //__dirname pega o diretório desse arquivo
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true
};