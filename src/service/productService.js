import axios from 'axios'

const baseURL = 'http://localhost:3000';
// const baseURL = 'https://cara.c0smic.tech';

const getAllProducts = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return await axios.get(`${baseURL}/products/json${queryParams ? `?${queryParams}` : ''}`)
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

const getProductDetails = async (productId) => {
    return await axios.get(`${baseURL}/products/json/${productId}`)
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

const createProduct = async (formData) => {
    return await axios.post(`${baseURL}/products/json`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
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

const updateProduct = async (productId, formData) => {
    return await axios.put(`${baseURL}/products/json/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
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

const deleteProduct = async (productId) => {
    return await axios.delete(`${baseURL}/products/json/${productId}`)
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

const deleteProductPhoto = async (productId, photoId) => {
    const endpoint = photoId === 'main' 
        ? `${baseURL}/products/json/${productId}/photo/main`
        : `${baseURL}/products/json/${productId}/photos/${photoId}`
    
    return await axios.delete(endpoint)
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

const getCategories = async () => {
    return await axios.get(`${baseURL}/categories/api`)
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

const getManufacturers = async () => {
    return await axios.get(`${baseURL}/manufacturers/api`)
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

const getProductCategories = async () => {
    return await axios.get(`${baseURL}/products/product-categories/api`)
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

const getStatuses = async () => {
    return await axios.get(`${baseURL}/statuses/api`)
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
    getAllProducts,
    getProductDetails,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductPhoto,
    getCategories,
    getManufacturers,
    getProductCategories,
    getStatuses
}