import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

import PointController from './controllers/PointsController';
import ItemController from './controllers/ItemController';

const pointController = new PointController();
const itemController = new ItemController();

const routes = express.Router(); //Serve para desacoplar as rotas do arquivo principal da aplicação para outros arquivos
const upload = multer(multerConfig);

routes.get('/items', itemController.index);
routes.get('/points/:id', pointController.show);
routes.get('/points', pointController.index);

routes.post(
    '/points', 
    upload.single('image'),
    celebrate({//Para validar os dados
        body: Joi.object().keys({
            name:Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    pointController.create);//Com o indicativo de que uma imagem será upada

export default routes;
