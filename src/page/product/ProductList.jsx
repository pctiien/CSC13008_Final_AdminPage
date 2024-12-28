import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get initial states from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterManufacturer, setFilterManufacturer] = useState(searchParams.get('manufacturer') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [sortConfig, setSortConfig] = useState({
    field: searchParams.get('sortField') || 'created_at',
    direction: searchParams.get('sortDir') || 'desc'
  });
  
  const itemsPerPage = 10;

  // Update URL when filters change
  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  };

  // Update search parameter
  useEffect(() => {
    updateURLParams({ search: searchTerm });
  }, [searchTerm]);

  // Update filter parameters
  useEffect(() => {
    updateURLParams({ 
      category: filterCategory,
      manufacturer: filterManufacturer
    });
  }, [filterCategory, filterManufacturer]);

  // Update sort parameters
  useEffect(() => {
    updateURLParams({ 
      sortField: sortConfig.field,
      sortDir: sortConfig.direction
    });
  }, [sortConfig]);

  // Update page parameter
  useEffect(() => {
    updateURLParams({ page: currentPage.toString() });
  }, [currentPage]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          productsRes, 
          categoriesRes, 
          manufacturersRes,
          productCategoriesRes,
          statusesRes
        ] = await Promise.all([
          axios.get('http://localhost:3000/products/json'),
          axios.get('http://localhost:3000/categories/api'),
          axios.get('http://localhost:3000/manufacturers/api'),
          axios.get('http://localhost:3000/products/product-categories/api'),
          axios.get('http://localhost:3000/statuses/api')
        ]);

        // Create lookup maps
        const categoryMap = new Map(
          categoriesRes.data.map(cat => [cat.category_id, cat.category_name])
        );
        const manufacturerMap = new Map(
          manufacturersRes.data.map(mfr => [mfr.manufacturer_id, mfr.m_name])
        );
        const statusMap = new Map(
          statusesRes.data
            .filter(status => status.status_type === "PRODUCT")
            .map(status => [status.status_id, status.status_name])
        );

        // Create product-category lookup
        const productCategoryMap = new Map();
        productCategoriesRes.data.forEach(pc => {
          const categories = productCategoryMap.get(pc.product_id) || [];
          if (categoryMap.has(pc.category_id)) {
            categories.push(categoryMap.get(pc.category_id));
          }
          productCategoryMap.set(pc.product_id, categories);
        });

        // Transform the products data
        const transformedData = productsRes.data.map(product => ({
          id: product.product_id,
          name: product.product_name,
          category: productCategoryMap.get(product.product_id)?.join(', ') || 'Uncategorized',
          manufacturer: product.manufacturer_id 
            ? manufacturerMap.get(product.manufacturer_id) 
            : 'Unknown',
          manufacturer_id: product.manufacturer_id,
          price: product.price,
          stock: product.remaining,
          status: product.status_id 
            ? statusMap.get(product.status_id) 
            : 'Unknown',
          image: product.img,
          created_at: new Date(product.created_at)
        }));

        setCategories(categoriesRes.data);
        setManufacturers(manufacturersRes.data);
        setProductCategories(productCategoriesRes.data);
        setStatuses(statusesRes.data.filter(status => status.status_type === "PRODUCT"));
        setProducts(transformedData);
        setError(null);
      } catch (err) {
        setError('Error loading data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (sortConfig.field === 'created_at') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      if (sortConfig.field === 'price') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
      case 'SOLD_OUT':
        return 'bg-red-100 text-red-800';
      case 'ON_SALE':
        return 'bg-blue-100 text-blue-800';
      case 'DISCONTINUED':
        return 'bg-gray-100 text-gray-800';
      case 'COMING_SOON':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusDisplay = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category.includes(filterCategory);
    const matchesManufacturer = filterManufacturer === '' || product.manufacturer_id === parseInt(filterManufacturer);
    return matchesSearch && matchesCategory && matchesManufacturer;
  });

  const sortedProducts = sortProducts(filteredProducts);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

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
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-48">
          <select
            className="w-full p-2 border rounded-lg"
            value={filterCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_name}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <select
            className="w-full p-2 border rounded-lg"
            value={filterManufacturer}
            onChange={handleManufacturerChange}
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map(manufacturer => (
              <option key={manufacturer.manufacturer_id} value={manufacturer.manufacturer_id}>
                {manufacturer.m_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort('price')}
                >
                  Price {getSortIcon('price')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer flex items-center gap-1"
                  onClick={() => handleSort('created_at')}
                >
                  Created At {getSortIcon('created_at')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.manufacturer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {formatStatusDisplay(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.created_at.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-violet-600 hover:text-violet-900 mr-3">
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, sortedProducts.length)}
                </span>{' '}
                of <span className="font-medium">{sortedProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-violet-600 border-violet-600 text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;