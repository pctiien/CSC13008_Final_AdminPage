import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import manufacturerService from '../../service/manufacturerService';

const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [newManufacturer, setNewManufacturer] = useState({
    m_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchManufacturers = async () => {
    try {
      const response = await manufacturerService.getAllManufacturers();
      if (response.data) {
        setManufacturers(response.data);
        setError(null);
      } else {
        throw new Error('Failed to fetch manufacturers');
      }
    } catch (err) {
      setError('Failed to fetch manufacturers. Please try again later.');
      console.error('Error fetching manufacturers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleAddManufacturer = async () => {
    if (!newManufacturer.m_name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await manufacturerService.createManufacturer({
        m_name: newManufacturer.m_name
      });
      
      if (response.data) {
        setManufacturers([...manufacturers, response.data]);
        setNewManufacturer({ m_name: '' });
        setIsAddModalOpen(false);
      } else {
        throw new Error('Failed to add manufacturer');
      }
    } catch (err) {
      setError('Failed to add manufacturer. Please try again.');
      console.error('Error adding manufacturer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateManufacturer = async () => {
    if (!selectedManufacturer || !selectedManufacturer.m_name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await manufacturerService.updateManufacturer(
        selectedManufacturer.manufacturer_id, 
        { m_name: selectedManufacturer.m_name }
      );

      if (response.data) {
        setManufacturers(manufacturers.map(m => 
          m.manufacturer_id === selectedManufacturer.manufacturer_id ? response.data : m
        ));
        setIsEditModalOpen(false);
        setSelectedManufacturer(null);
      } else {
        throw new Error('Failed to update manufacturer');
      }
    } catch (err) {
      setError('Failed to update manufacturer. Please try again.');
      console.error('Error updating manufacturer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteManufacturer = async (manufacturerId) => {
    if (!window.confirm('Are you sure you want to delete this manufacturer?')) {
      return;
    }

    try {
      const response = await manufacturerService.deleteManufacturer(manufacturerId);
      if (response.success) {
        setManufacturers(manufacturers.filter(m => m.manufacturer_id !== manufacturerId));
        setError(null);
      } else {
        throw new Error('Failed to delete manufacturer');
      }
    } catch (err) {
      setError('Failed to delete manufacturer. Please try again.');
      console.error('Error deleting manufacturer:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="ml-2">Loading manufacturers...</span>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manufacturer Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
        >
          <Plus size={20} /> Add Manufacturer
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {manufacturers.map((manufacturer) => (
              <tr key={manufacturer.manufacturer_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {manufacturer.manufacturer_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {manufacturer.m_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => {
                      setSelectedManufacturer(manufacturer);
                      setIsEditModalOpen(true);
                    }}
                    className="text-violet-600 hover:text-violet-900 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteManufacturer(manufacturer.manufacturer_id)}
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
            <h2 className="text-xl font-bold mb-4">Add New Manufacturer</h2>
            <input
              type="text"
              placeholder="Manufacturer Name"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={newManufacturer.m_name}
              onChange={(e) => setNewManufacturer({ m_name: e.target.value })}
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
                onClick={handleAddManufacturer}
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
      {isEditModalOpen && selectedManufacturer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Edit Manufacturer</h2>
            <input
              type="text"
              placeholder="Manufacturer Name"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={selectedManufacturer.m_name}
              onChange={(e) => setSelectedManufacturer({
                ...selectedManufacturer,
                m_name: e.target.value
              })}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedManufacturer(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateManufacturer}
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

export default ManufacturerList;