import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import categoryService from '../../service/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ category_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.data) {
        setCategories(response.data);
        setError(null);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      setError('Failed to fetch categories. Please try again later.');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.category_name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await categoryService.createCategory({
        category_name: newCategory.category_name
      });
      
      if (response.data) {
        setCategories([...categories, response.data]);
        setNewCategory({ category_name: '' });
        setIsAddModalOpen(false);
      } else {
        throw new Error('Failed to add category');
      }
    } catch (err) {
      setError('Failed to add category. Please try again.');
      console.error('Error adding category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await categoryService.deleteCategory(categoryId);
        
        if (response.status === 204 || response.data) {
          setCategories(categories.filter(cat => cat.category_id !== categoryId));
          setError(null);
        } else {
          throw new Error('Failed to delete category');
        }
      } catch (err) {
        setError('Failed to delete category. Please try again.');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !selectedCategory.category_name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await categoryService.updateCategory(
        selectedCategory.category_id, 
        { category_name: selectedCategory.category_name }
      );

      if (response.data) {
        setCategories(categories.map(cat => 
          cat.category_id === selectedCategory.category_id ? response.data : cat
        ));
        setIsEditModalOpen(false);
        setSelectedCategory(null);
      } else {
        throw new Error('Failed to update category');
      }
    } catch (err) {
      setError('Failed to update category. Please try again.');
      console.error('Error updating category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.category_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.category_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.category_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(category.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(category.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsEditModalOpen(true);
                    }}
                    className="text-violet-600 hover:text-violet-900 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={newCategory.category_name}
              onChange={(e) => setNewCategory({ category_name: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={isSubmitting}
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={selectedCategory.category_name}
              onChange={(e) => setSelectedCategory({
                ...selectedCategory,
                category_name: e.target.value
              })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                disabled={isSubmitting}
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;