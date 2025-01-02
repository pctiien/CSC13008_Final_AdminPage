import axiosClient from './axiosClient'

const getRevenueReport = async(timeRange, startDate, endDate)=>{
    return await axiosClient.get('/reports/revenue-report',{params:{timeRange, startDate, endDate}})
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

const getTopRevenueReport = async(timeRange, startDate, endDate)=>{
    return await axiosClient.get('/reports/top-revenue-product',{params:{timeRange, startDate, endDate}})
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



export default {getTopRevenueReport,getRevenueReport}