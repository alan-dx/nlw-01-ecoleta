import axios from 'axios';

const api = axios.create({//Incialização do axios
    baseURL: 'http://localhost:3333'//URL base
});

export default api;
