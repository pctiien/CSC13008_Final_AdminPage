import axiosClient from './axiosClient'

const getAllUsers = async(page,limit,searchKey,sortBy,sortOrder)=>{
    console.log(sortBy,sortOrder)
    return await axiosClient.get('/users',{
        params: { page, limit, search: searchKey, sortBy, sortOrder },
      })
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