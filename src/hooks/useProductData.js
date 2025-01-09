import { useState, useEffect } from 'react';
import productService from '../service/productService';

export const useProductData = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    manufacturers: [],
    productCategories: [],
    statuses: [],
    loading: true,
    error: null
  });

  const removeProduct = (productId) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== productId)
    }));
  };

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
          productService.getAllProducts(),
          productService.getCategories(),
          productService.getManufacturers(),
          productService.getProductCategories(),
          productService.getStatuses()
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

        const productCategoryMap = new Map();
        productCategoriesRes.data.forEach(pc => {
          const categories = productCategoryMap.get(pc.product_id) || [];
          if (categoryMap.has(pc.category_id)) {
            categories.push(categoryMap.get(pc.category_id));
          }
          productCategoryMap.set(pc.product_id, categories);
        });

        const productsData = productsRes.data.data || productsRes.data;
        const transformedProducts = productsData.map(product => ({
          id: product.product_id,
          name: product.product_name,
          category: productCategoryMap.get(product.product_id)?.join(', ') || 'Uncategorized',
          manufacturer: product.manufacturer_id 
            ? manufacturerMap.get(product.manufacturer_id) 
            : 'Unknown',
          manufacturer_id: product.manufacturer_id,
          price: product.price,
          stock: product.remaining,
          total_purchase: product.total_purchase,
          status: product.status_id 
            ? statusMap.get(product.status_id) 
            : 'Unknown',
          image: product.img,
          created_at: new Date(product.created_at)
        }));

        setData({
          products: transformedProducts,
          categories: categoriesRes.data,
          manufacturers: manufacturersRes.data,
          productCategories: productCategoriesRes.data,
          statuses: statusesRes.data.filter(status => status.status_type === "PRODUCT"),
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Error loading data. Please try again later.'
        }));
      }
    };

    fetchAllData();
  }, []);

  return { ...data, removeProduct };
};