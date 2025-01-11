import axios from 'axios'

const baseURL = 'http://localhost:3000';
// const baseURL = 'https://cara.c0smic.tech';

const getAllCategories = async () => {
    return await axios.get(`${baseURL}/categories/api`, {
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

const createCategory = async (categoryData) => {
    return await axios.post(`${baseURL}/categories/api`, categoryData)
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

const updateCategory = async (categoryId, categoryData) => {
    return await axios.put(`${baseURL}/categories/api/${categoryId}`, categoryData)
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

const deleteCategory = async (categoryId) => {
    return await axios.delete(`${baseURL}/categories/api/${categoryId}`)
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

export default {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}