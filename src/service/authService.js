import axiosClient from './axiosClient'

const logIn = async(email,password)=>{
    return await axiosClient.post('/auth/login/json',{email,password},{withCredentials: true})
            .then(response=>{
                return {
                    data: response
                }
            })
            .catch(err=>{
                return{
                    data: null,
                    err
                }
            })
}

const logOut = async()=>{
    return await axiosClient.get('/auth/logout/json',{withCredentials: true})
            .then(response=>{
                console.log(response)
                return {
                    data: response
                }
            })  
            .catch(err=>{
                return{
                    data: null,
                    err
                }
            })
}



export default {logIn,logOut}