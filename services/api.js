import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://backend-gyz3.onrender.com/'  
});

export default instance;
