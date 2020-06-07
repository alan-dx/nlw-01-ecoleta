import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import Dropzone from '../../components/DropZone'

import './styles.css';

import logo from '../../assets/logo.svg';

//SEMPRE QUE FOR CRIADO UMA STATE PARA UM ARRAY OU OBJETO: MANUALMENTE INFORMAR O TIPO DE VARIÁVEL

interface Item {//Dizendo a estrutura dos elementos que vão vir da requisição é como criar um tipo
    id: number;
    title: string;
    image_url: string;
};

interface IBGEUFResponse {//Dizendo a estrutura dos elementos que vão vir da requisição é como criar um tipo
    sigla: string;
};

interface IBGECityResponse {//Dizendo a estrutura dos elementos que vão vir da requisição é como criar um tipo
    nome: string;
}

const CreatePoint = () => {
    
    const [items, setItmes] = useState<Item[]>([]);//Indicando qual o tipo/estrutura dos elementos que vão ser armazenados aqui
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const history = useHistory();//useHistory permite controlar a navegação programáticamente

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0]);
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    useEffect(() => {//Primeiro parâmetro: Qual função deve ser executada, Segundo Parâmetro: Quando deve ser executada
        api.get('items').then(response => {//items é passado como parâmtro pra baseUrl, .then é chamado apenas quando a requisição tiver uma resposta
            setItmes(response.data);
        });
    }, []);//Executar apenas quando o componente for montado

    useEffect(() => {//REQUISIÇÃO DAS UF'S
        //Feita com axios pq senão utilizaria a baseUrl
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            //.map perrcore o array
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que o usuário mudar o UF
        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            //.map perrcore o array
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        })

    }, [selectedUf]);

    useEffect(() => {
        //navigator é uma variável global que da acesso a funções do navegaqdor
        navigator.geolocation.getCurrentPosition(position => {//Pegando a posição atual do usuário
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    },[])

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {//ChangeEvent<HTMLSelectElement> é a indicação do tipo do evento, o parâmetro é passado automaticamente pelo função OnChange, HTMLChangeElement é a indicação que foi a mudança de um elemento HTML
        const uf = event.target.value;

        setSelectedUf(uf);
    };

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({...formData, [name]: value});//[name] serve para definir a variável como chave da propriedade
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);//Verificando se o item clicado já esta no array, verificando assim se ele já foi selecionando

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id );//Removendo os itens do array, pra quando ele já tiver selecionado

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id ]);
        }
        
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();//JSON não aceita arquivos

        //Criando o FormData
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile) {//Para verificar se a imagem foi adicionada pelo usuário
            data.append('image', selectedFile)
        }

        await api.post('points', data);

        alert('Ponto de coleta cadastrado!');

        history.push('/');//Redirecionando o usuário para a tela de Home
    }


    return (
        <div id='page-create-point'>
            <header>
                <img src={logo} alt='Ecoleta'/>

                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    
                    <div className='field'>
                        <label htmlFor='name'> Nome da Entidade</label>
                        <input 
                            type='text'
                            name='name'
                            id='name'
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className='field'>
                            <label htmlFor='email'> E-mail</label>
                            <input 
                                type='email'
                                name='email'
                                id='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='field'>
                            <label htmlFor='whatsapp'>Whatsapp</label>
                            <input 
                                type='text'
                                name='whatsapp'
                                id='whatsapp'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o enderço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>

                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className='field-group'>
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name='uf' 
                                value={selectedUf} 
                                id='uf' 
                                onChange={handleSelectedUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name='uf' 
                                id='uf'
                                value={selectedCity}
                                onChange={handleSelectedCity}
                                >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className='items-grid'>
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                                onClick={/*Tem que ser assim quando passa parâmetro p função*/() => handleSelectItem(item.id)} 
                                >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))};
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default CreatePoint;