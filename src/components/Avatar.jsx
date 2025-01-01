const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Avatar({ children, className = "" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
    </div>
  )
}

export function AvatarImage({ src, alt }) {
  if (!src) return null;
  
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full rounded-full object-cover"
    />
  )
}

export function AvatarFallback({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-900">
      {children}
    </div>
  )
}

