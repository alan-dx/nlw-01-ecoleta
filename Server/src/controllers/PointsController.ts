import {Request, Response} from 'express';
import knex from '../database/connection';

class PointController {
    async show(request:Request, response:Response) {
        const id = request.params.id;

        const point = await knex('points').where('id',id).first();//Pegando as informações do elemento com esse id

        if(!point) {
            return response.status(400).json({message:'Point not found'});
        }

        const serializedPoint = {
            ...point,
            image_url: `http://10.0.0.8:3333/uploads/${point.image}`
        }

        const items = await knex('items')//ESSA PARTE É DO SQLITE3 E EU NÃO ENTENDI
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        return response.json({point: serializedPoint, items});
    }

    async create(request: Request, response: Response) {
        
        const {//Descontrução de objetos, esse é o request body
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items   
        } = request.body;

        const trx = await knex.transaction();//Para evitar que caso ocorra um erro na segunda querry abaixo, a primeira seja executada indevidamente

        const point = {//Short Syntax Object
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))//convertendo pra array
        .map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        })

        await trx('point_items').insert(pointItems);

        await trx.commit();//Commit obrigatóro

        return response.json({
            id:point_id,
            ...point,
        });

    }

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://10.0.0.8:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints);
    }
};

export default PointController;
