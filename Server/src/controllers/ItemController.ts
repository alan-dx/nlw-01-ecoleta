import knex from '../database/connection';
import {Request, Response} from 'express';

class ItemController {
    async index(request: Request, response: Response) { //:id indica que um paramentro será passado com o idendtificado 'id'
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {//serializar é o ato de modificar as informações passadas pelo back-end para a forma correta que o front-end deve receber
        return {
            id:item.id, 
            title:item.title,
            image_url:`http://10.0.0.8:3333/uploads/${item.image}`
        }
    })

    return response.json(serializedItems);
    }
}

export default ItemController;