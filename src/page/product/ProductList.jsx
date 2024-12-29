import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import Pagination from './Pagination';
import { useProductData } from '../../hooks/useProductData';
import { sortProducts } from '../../utils/productUtils';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
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
  const { products, categories, manufacturers, loading, error, removeProduct } = useProductData();

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

  // Effect hooks for URL params
  React.useEffect(() => {
    updateURLParams({ search: searchTerm });
  }, [searchTerm]);

  React.useEffect(() => {
    updateURLParams({ 
      category: filterCategory,
      manufacturer: filterManufacturer
    });
  }, [filterCategory, filterManufacturer]);

  React.useEffect(() => {
    updateURLParams({ 
      sortField: sortConfig.field,
      sortDir: sortConfig.direction
    });
  }, [sortConfig]);

  React.useEffect(() => {
    updateURLParams({ page: currentPage.toString() });
  }, [currentPage]);

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

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleProductDeleted = (deletedProductId) => {
    removeProduct(deletedProductId);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category.includes(filterCategory);
    const matchesManufacturer = filterManufacturer === '' || product.manufacturer_id === parseInt(filterManufacturer);
    return matchesSearch && matchesCategory && matchesManufacturer;
  });

  const sortedProducts = sortProducts(filteredProducts, sortConfig);

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
          products={currentItems}
          sortConfig={sortConfig}
          onSort={handleSort}
          onProductDeleted={handleProductDeleted}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={sortedProducts.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductList;