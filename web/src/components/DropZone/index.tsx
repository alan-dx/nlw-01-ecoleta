import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;//Criando a interface da função passada como prop
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
    const [selctedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];//Pegando a única imagem enviada

        const fileUrl = URL.createObjectURL(file);

        onFileUploaded(file);
        setSelectedFileUrl(fileUrl);
    }, [onFileUploaded])
    
    const {getRootProps, getInputProps} = useDropzone({
        onDrop,accept:'image/*'//accept é para aceitar arquivos que são somente imagens
        })

    return (
        <div className='dropzone' {...getRootProps()}>
        <input {...getInputProps()} accept="image/*"/>

        { selctedFileUrl
            ? <img src={selctedFileUrl} alt='Point thumbnail' />
            : (
                <p>
                    <FiUpload />
                    Imagem do estabelecimento
                </p>
            )
        }
        </div>
    )

}

export default Dropzone;