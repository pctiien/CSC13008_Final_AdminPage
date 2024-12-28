export const getStatusColor = (status) => {
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

export const formatStatusDisplay = (status) => {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const sortProducts = (products, sortConfig) => {
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