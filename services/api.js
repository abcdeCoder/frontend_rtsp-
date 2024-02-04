import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://backend-gyz3.onrender.com/'  // Adjust if your Flask API is running on a different port
});

export default instance;
