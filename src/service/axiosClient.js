import axios from 'axios'

const baseUrl = 'http://localhost:3000';
// const baseUrl = 'https://cara.c0smic.tech';

const axiosClient = axios.create({
    baseURL : baseUrl,
    headers : {
        "Content-Type": "application/json"
    },
    withCredentials: true
})
// axiosClient.interceptors.request.use((config) => {
//     let token = null
//     const data = localStorage.getItem('user')
//     if(data)
//     {
//         const user = JSON.parse(data)
//         if(user)
//         {
//             token = user.token
//         }
//     }
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`; 
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });
export default axiosClient