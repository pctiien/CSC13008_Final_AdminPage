import axiosClient from './axiosClient'

const getAllUsers = async(page,limit)=>{
    console.log(page,limit)
    return await axiosClient.get(`/users?page=${page}&limit=${limit}`)
            .then(response=>{
                return {
                    data: response.data
                }
            })
            .catch(err=>{
                return{
                    data: null,
                    err
                }
            })
}

export default {getAllUsers}