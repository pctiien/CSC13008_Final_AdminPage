const Checkbox = ({ label, id, ...props }) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={id}
          className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          {...props}
        />
        <label 
          htmlFor={id}
          className="text-sm text-gray-700 cursor-pointer"
        >
          {label}
        </label>
      </div>
    )
  }
  
export default Checkbox
  
  