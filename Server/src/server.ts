//CRIAÇÃO DO SERVIDOR BACK-END
import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());//Indicando para o express qual o formato são passados os request
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))); //Criando a rota para as imagens, express.static() permite criar rotas para arquivos estáticos

app.use(errors());

app.listen(3333);//Cria um localhost habilitando essa porta