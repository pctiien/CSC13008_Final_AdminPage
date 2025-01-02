import { useState, useRef, useEffect, createContext, useContext } from 'react'

const PopoverContext = createContext({})

export function Popover({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative" ref={popoverRef}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ children, asChild }) {
  const { isOpen, setIsOpen } = useContext(PopoverContext)
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {asChild ? children : <button>{children}</button>}
    </div>
  )
}

export function PopoverContent({ children, align = 'center', className = '' }) {
  const { isOpen } = useContext(PopoverContext)
  
  if (!isOpen) return null

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div className={`absolute z-50 mt-2 bg-background border rounded-lg shadow-lg ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  )
}

