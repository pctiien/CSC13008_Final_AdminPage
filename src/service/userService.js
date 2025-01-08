import axiosClient from './axiosClient'

const getAllUsers = async(page,limit,searchKey,sortBy,sortOrder)=>{
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

const getUserDetails = async(userId)=>{
    return await axiosClient.get(`/users/${userId}`)
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
const toggleBanUser = async(userId)=>{
    return await axiosClient.patch(`/users/${userId}/toggle-ban`)
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

const updateProfile = async(profile)=>{
    return await axiosClient.patch(`/users/update-profile`,{...profile})
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
export default {getAllUsers,getUserDetails,toggleBanUser,updateProfile}