import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.100.12:3333/' // Essa URL pode ter de ser alterada para representar corretamente o host da API na LAN em que for implementada.
});

export default api;