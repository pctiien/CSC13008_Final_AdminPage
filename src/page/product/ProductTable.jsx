import React from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, formatStatusDisplay } from '../../utils/productUtils';

const ProductTable = ({ 
  products, 
  sortConfig, 
  onSort,
  onProductDeleted,
  isDeletingProduct
}) => {
  const navigate = useNavigate();

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await onProductDeleted(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown size={16} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer group"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1 hover:text-gray-700">
        {children}
        <span className="inline-flex">{getSortIcon(field)}</span>
      </div>
    </th>
  );

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative">
      {isDeletingProduct && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Manufacturer
            </th>
            <SortableHeader field="price">Price</SortableHeader>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stock
            </th>
            <SortableHeader field="total_purchase">Purchases</SortableHeader> 
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <SortableHeader field="created_at">Created At</SortableHeader>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.manufacturer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.price} VND
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.total_purchase}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}
                >
                  {formatStatusDisplay(product.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.created_at.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  className="text-violet-600 hover:text-violet-900 mr-3"
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  disabled={isDeletingProduct}
                >
                  <Pencil size={18} />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeletingProduct}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;