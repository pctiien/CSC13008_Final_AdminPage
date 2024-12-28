import React from 'react';
import { Search } from 'lucide-react';

const ProductFilters = ({ 
  searchTerm, 
  filterCategory, 
  filterManufacturer, 
  categories, 
  manufacturers,
  onSearchChange,
  onCategoryChange,
  onManufacturerChange 
}) => {
  return (
    <div className="mb-6 flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="w-48">
        <select
          className="w-full p-2 border rounded-lg"
          value={filterCategory}
          onChange={onCategoryChange}
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
          onChange={onManufacturerChange}
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
  );
};

export default ProductFilters;