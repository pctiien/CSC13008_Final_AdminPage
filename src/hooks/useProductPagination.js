import { useState, useEffect } from 'react';
import axios from 'axios';

export const useProductPagination = (itemsPerPage = 10) => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    products: [],
    totalItems: 0,
    currentPage: 1,
    filters: {
      search: '',
      category: '',
      manufacturer: '',
      sortField: 'created_at',
      sortDir: 'desc'
    }
  });

  const fetchProducts = async (filters, page) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category_id: filters.category }),
        ...(filters.manufacturer && { manufacturer_id: filters.manufacturer }),
        sort_field: filters.sortField,
        sort_dir: filters.sortDir
      });
  
      const response = await axios.get(`http://localhost:3000/products/json?${params}`);
      
      // Transform the products to ensure dates are properly parsed
      const transformedProducts = response.data.products.map(product => ({
        ...product,
        created_at: new Date(product.created_at)
      }));
  
      setState(prev => ({
        ...prev,
        loading: false,
        products: transformedProducts,
        totalItems: response.data.total,
        currentPage: page,
        error: null
      }));
    } catch (error) {
      console.error('Fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch products. Please try again.'
      }));
    }
  };

  const setPage = (page) => {
    fetchProducts(state.filters, page);
  };

  const setFilters = (newFilters) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    setState(prev => ({ ...prev, filters: updatedFilters }));
    fetchProducts(updatedFilters, 1); // Reset to first page when filters change
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts(state.filters, state.currentPage);
  }, []);

  return {
    ...state,
    setPage,
    setFilters,
    totalPages: Math.ceil(state.totalItems / itemsPerPage)
  };
};