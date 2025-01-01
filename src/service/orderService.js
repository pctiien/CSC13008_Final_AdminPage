import axiosClient from './axiosClient'

const getAllOrders = async(paymentStatus)=>{
    return await axiosClient.get('/order/all',{params:{paymentStatus}})
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

const getOrderDetails = async(orderId)=>{
    return await axiosClient.get(`/order/${orderId}`)
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

const updateOrderStatus = async(orderId,paymentStatus)=>{
    return await axiosClient.patch(`/order/${orderId}`,{paymentStatus})
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

export default {getAllOrders,getOrderDetails,updateOrderStatus}