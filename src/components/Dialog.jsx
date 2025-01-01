'use client'

import { createContext, useContext } from 'react'

const DialogContext = createContext()

export function Dialog({ children, open, onOpenChange }) {
  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogContent({ children }) {
  const { open, setOpen } = useContext(DialogContext)
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => setOpen(false)}
      />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children }) {
  return (
    <div className="mb-4">
      {children}
    </div>
  )
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold">
      {children}
    </h2>
  )
}

