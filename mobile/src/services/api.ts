import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.0.8:3333'//O sistema não reconhece localHost
});

export default api;