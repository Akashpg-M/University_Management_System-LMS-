import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Change this to your server's base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optionally, you can add interceptors here
// instance.interceptors.request.use(config => {
//     // Modify config before sending request
//     return config;
// }, error => {
//     // Handle error
//     return Promise.reject(error);
// });

export default instance;


