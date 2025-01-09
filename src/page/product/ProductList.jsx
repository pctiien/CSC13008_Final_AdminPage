import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import Pagination from './Pagination';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterManufacturer, setFilterManufacturer] = useState(searchParams.get('manufacturer') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [sortConfig, setSortConfig] = useState({
    field: searchParams.get('sortField') || 'created_at',
    direction: searchParams.get('sortDir') || 'desc'
  });
  
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortField: sortConfig.field,
        sortDir: sortConfig.direction
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      if (filterManufacturer) params.append('manufacturer', filterManufacturer);

      const response = await axios.get('http://localhost:3000/products/json?' + params.toString());
      
      if (!response.data.success) {
        throw new Error('Failed to fetch products');
      }
      
      const transformedProducts = response.data.data.map(product => ({
        id: product.product_id,
        name: product.product_name,
        category: product.categories ? product.categories.map(c => c.category_name).join(', ') : 'Uncategorized',
        manufacturer: product.manufacturer_name || 'Unknown',
        manufacturer_id: product.manufacturer_id,
        price: product.price,
        stock: product.remaining,
        total_purchase: product.total_purchase,
        status: product.status_name,
        created_at: new Date(product.created_at)
      }));

      setProducts(transformedProducts);
      setTotalItems(response.data.pagination.total);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, manufacturersRes] = await Promise.all([
          axios.get('http://localhost:3000/categories/api'),
          axios.get('http://localhost:3000/manufacturers/api')
        ]);
        
        setCategories(categoriesRes.data);
        setManufacturers(manufacturersRes.data);
      } catch (err) {
        setError('Failed to load initial data');
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filterCategory, filterManufacturer, sortConfig]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    
    if (filterCategory) {
      newParams.set('category', filterCategory);
    } else {
      newParams.delete('category');
    }
    
    if (filterManufacturer) {
      newParams.set('manufacturer', filterManufacturer);
    } else {
      newParams.delete('manufacturer');
    }
    
    newParams.set('page', currentPage.toString());
    newParams.set('sortField', sortConfig.field);
    newParams.set('sortDir', sortConfig.direction);
    
    setSearchParams(newParams);
  }, [searchTerm, filterCategory, filterManufacturer, currentPage, sortConfig]);

  const handleProductDeleted = async (productId) => {
    setIsDeletingProduct(true);
    setError(null);
    
    try {
      await axios.delete(`http://localhost:3000/products/json/${productId}`);
      
      // Calculate new total and total pages
      const newTotalItems = totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      
      // Update total items
      setTotalItems(newTotalItems);
      
      // Handle pagination
      if (currentPage > newTotalPages) {
        // If we're on a page that no longer exists, go to the last page
        setCurrentPage(Math.max(1, newTotalPages));
      } else {
        // Refresh current page
        await fetchProducts();
      }
      
      setSuccessMessage('Product deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to delete product');
      throw error;
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleManufacturerChange = (e) => {
    setFilterManufacturer(e.target.value);
    setCurrentPage(1);
  };

  if (loading && !isDeletingProduct) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
        <button
          onClick={() => navigate('/add-product')}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <ProductFilters
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        filterManufacturer={filterManufacturer}
        categories={categories}
        manufacturers={manufacturers}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onManufacturerChange={handleManufacturerChange}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ProductTable
          products={products}
          sortConfig={sortConfig}
          onSort={handleSort}
          onProductDeleted={handleProductDeleted}
          isDeletingProduct={isDeletingProduct}
        />

        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;