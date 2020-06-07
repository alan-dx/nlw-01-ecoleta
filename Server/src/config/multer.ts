import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination:path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {//Gerando um nome único para o arquivo upado
            const hash = crypto.randomBytes(6).toString('hex');//.randomBytes() quantidade de bytes do hash e .toString() para converter para String. Gerando caracteres aletórios que serão implementados no nome único do arquivo

            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName);//Função chamada após tudo ser executado, o primeiro parm é o erro que seria executado casso houvesse
        }
    })
};