export function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-500",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900"
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-sm"
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

