import axiosClient from './axiosClient'

const logIn = async(email,password)=>{
    return await axiosClient.post('/auth/login/json',{email,password},{withCredentials: false})
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
    return await axiosClient.post('/auth/logout/json',{withCredentials: true})
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



export default {logIn,logOut}