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
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterManufacturer, setFilterManufacturer] = useState(searchParams.get('manufacturer') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [sortConfig, setSortConfig] = useState({
    field: searchParams.get('sortField') || 'created_at',
    direction: searchParams.get('sortDir') || 'desc'
  });
  
  const itemsPerPage = 10;

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
        
        const transformedProducts = response.data.data.map(function(product) {
          return {
            id: product.product_id,
            name: product.product_name,
            category: product.categories ? product.categories.map(function(c) { 
              return c.category_name; 
            }).join(', ') : 'Uncategorized',
            manufacturer: product.manufacturer_name || 'Unknown',
            manufacturer_id: product.manufacturer_id,
            price: product.price,
            stock: product.remaining,
            total_purchase: product.total_purchase,
            status: product.status_name,
            created_at: new Date(product.created_at)
          };
        });

        setProducts(transformedProducts);
        setTotalItems(response.data.pagination.total);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

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

  const handleSort = function(field) {
    setSortConfig(function(prevConfig) {
      return {
        field: field,
        direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
      };
    });
    setCurrentPage(1);
  };

  const handleSearchChange = function(e) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = function(e) {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleManufacturerChange = function(e) {
    setFilterManufacturer(e.target.value);
    setCurrentPage(1);
  };

  const handleProductDeleted = async function(productId) {
    try {
      await axios.delete('http://localhost:3000/products/json/' + productId);
      setProducts(function(prevProducts) {
        return prevProducts.filter(function(product) {
          return product.id !== productId;
        });
      });
      setTotalItems(function(prev) { 
        return prev - 1; 
      });
    } catch (error) {
      setError('Failed to delete product');
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
        <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
        <button
          onClick={function() { navigate('/add-product'); }}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

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
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductList;