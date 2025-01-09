import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import productService from '../../service/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  const initialFormState = {
    name: '',
    price: '',
    description: '',
    stock: '',
    status_id: '',
    manufacturer_id: '',
    categories: []
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, manufacturersRes, statusesRes] = await Promise.all([
          productService.getCategories(),
          productService.getManufacturers(),
          productService.getStatuses()
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (manufacturersRes.data) setManufacturers(manufacturersRes.data);
        if (statusesRes.data) {
          setStatuses(statusesRes.data.filter(status => status.status_type === "PRODUCT"));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load initial data');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      categories: values
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImages([]);
    setPreviews(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return [];
    });
    setError('');
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters long');
    }
    
    const price = parseFloat(formData.price);
    if (!price || isNaN(price) || price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push('Stock must be a non-negative number');
    }
    
    if (!formData.status_id) {
      errors.push('Please select a status');
    }
    
    if (!formData.manufacturer_id) {
      errors.push('Please select a manufacturer');
    }
    
    if (!formData.categories || formData.categories.length === 0) {
      errors.push('Please select at least one category');
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidSizeImages = images.filter(img => img.size > maxSize);
    if (invalidSizeImages.length > 0) {
      errors.push('Some images exceed the 5MB size limit');
    }
  
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
  
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formDataToSend.append(`${key}[]`, v));
        } else {
          formDataToSend.append(key, value);
        }
      });
  
      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });
  
      const response = await productService.createProduct(formDataToSend);
  
      if (response.data?.success) {
        setSuccess('Product created successfully! You can continue adding more products.');
        resetForm();
      } else {
        setError(response.data?.message || 'Error creating product');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              className="mt-1 block w-full p-2 border rounded-lg"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              required
              className="mt-1 block w-full p-2 border rounded-lg"
              value={formData.stock}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status_id"
              required
              className="mt-1 block w-full p-2 border rounded-lg"
              value={formData.status_id}
              onChange={handleInputChange}
            >
              <option value="">Select Status</option>
              {statuses.map(status => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <select
              name="manufacturer_id"
              className="mt-1 block w-full p-2 border rounded-lg"
              value={formData.manufacturer_id}
              onChange={handleInputChange}
            >
              <option value="">Select Manufacturer</option>
              {manufacturers.map(manufacturer => (
                <option key={manufacturer.manufacturer_id} value={manufacturer.manufacturer_id}>
                  {manufacturer.m_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <select
              multiple
              name="categories"
              className="mt-1 block w-full p-2 border rounded-lg h-32"
              value={formData.categories}
              onChange={handleCategoryChange}
            >
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="4"
            className="mt-1 block w-full p-2 border rounded-lg"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-violet-600 rounded-lg tracking-wide border border-violet-600 cursor-pointer hover:bg-violet-50">
              <Upload size={24} />
              <span className="mt-2 text-base">Select product images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Reset Form
          </button>
          <button
            type="button"
            onClick={() => navigate('/product')}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Back to Products
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;