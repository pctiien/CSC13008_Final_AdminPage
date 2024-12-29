import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    status: '',
    category: '',
    manufacturer: '',
    photos: []
  });
  
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [
          productRes, 
          categoriesRes, 
          manufacturersRes, 
          statusesRes,
          productCategoriesRes
        ] = await Promise.all([
          axios.get(`http://localhost:3000/products/json/${id}`),
          axios.get('http://localhost:3000/categories/api'),
          axios.get('http://localhost:3000/manufacturers/api'),
          axios.get('http://localhost:3000/statuses/api'),
          axios.get('http://localhost:3000/products/product-categories/api')
        ]);
  
        // Filter product categories to get category IDs for this product
        const productCategoryIds = productCategoriesRes.data
          .filter(pc => pc.product_id === parseInt(id))
          .map(pc => pc.category_id);
  
        setFormData({
          name: productRes.data.product_name,
          price: productRes.data.price,
          stock: productRes.data.remaining,
          status: productRes.data.status_id,
          category: productCategoryIds[0], // For single select, use the first category
          // OR for multi-select:
          // categories: productCategoryIds,
          manufacturer: productRes.data.manufacturer_id,
          photos: productRes.data.photos || []
        });
  
        setCategories(categoriesRes.data);
        setManufacturers(manufacturersRes.data);
        setStatuses(statusesRes.data.filter(status => status.status_type === "PRODUCT"));
        setLoading(false);
      } catch (err) {
        setError('Failed to load product data');
        setLoading(false);
      }
    };
  
    fetchProductData();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) errors.stock = 'Valid stock quantity is required';
    if (!formData.status) errors.status = 'Status is required';
    if (!formData.manufacturer) errors.manufacturer = 'Manufacturer is required';
    if (!formData.category) errors.category = 'Category is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const response = await axios.post(`http://localhost:3000/products/${id}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...response.data.photos]
      }));
    } catch (err) {
      setError('Failed to upload photos');
    }
  };

  const handleRemovePhoto = async (photoId) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}/photos/${photoId}`);
      setFormData(prev => ({
        ...prev,
        photos: prev.photos.filter(photo => photo.id !== photoId)
      }));
    } catch (err) {
      setError('Failed to remove photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:3000/products/json/${id}`, {
        product_name: formData.name,
        price: formData.price,
        remaining: formData.stock,
        status_id: formData.status,
        category_id: formData.category,
        manufacturer_id: formData.manufacturer
      });

      navigate('/product');
    } catch (err) {
      setError('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-lg ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-lg ${
                validationErrors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.price && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.price}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-lg ${
                validationErrors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.stock && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.stock}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-lg ${
                validationErrors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Status</option>
              {statuses.map(status => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
            {validationErrors.status && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.status}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-lg ${
                validationErrors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
            )}
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer
            </label>
            <select
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-lg ${
                validationErrors.manufacturer ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Manufacturer</option>
              {manufacturers.map(manufacturer => (
                <option key={manufacturer.manufacturer_id} value={manufacturer.manufacturer_id}>
                  {manufacturer.m_name}
                </option>
              ))}
            </select>
            {validationErrors.manufacturer && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.manufacturer}</p>
            )}
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Photos
          </label>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {formData.photos.map(photo => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.url}
                  alt="Product"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-violet-600 rounded-lg shadow-lg tracking-wide border border-violet-600 cursor-pointer hover:bg-violet-600 hover:text-white">
              <Upload size={24} />
              <span className="mt-2 text-base">Upload Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/product')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;