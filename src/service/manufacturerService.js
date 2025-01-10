import axios from 'axios';

const baseURL = 'http://localhost:3000';

const getAllManufacturers = async () => {
    return await axios.get(`${baseURL}/manufacturers/api`, {
        withCredentials: true
    })
        .then(response => {
            return {
                data: response.data
            }
        })
        .catch(err => {
            return {
                data: null,
                err
            }
        })
}

const createManufacturer = async (manufacturerData) => {
    return await axios.post(`${baseURL}/manufacturers/api`, manufacturerData)
        .then(response => {
            return {
                data: response.data
            }
        })
        .catch(err => {
            return {
                data: null,
                err
            }
        })
}

const updateManufacturer = async (manufacturerId, manufacturerData) => {
    return await axios.put(`${baseURL}/manufacturers/api/${manufacturerId}`, manufacturerData)
        .then(response => {
            return {
                data: response.data
            }
        })
        .catch(err => {
            return {
                data: null,
                err
            }
        })
}

const deleteManufacturer = async (manufacturerId) => {
    return await axios.delete(`${baseURL}/manufacturers/api/${manufacturerId}`)
        .then(response => {
            return {
                success: true,
                data: response.data
            }
        })
        .catch(err => {
            return {
                success: false,
                err
            }
        })
}

export default {
    getAllManufacturers,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer
}