'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: Toast['type'], duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[toast.type]

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }[toast.type]

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in-right`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-lg">{icon}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-2 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Convenience hooks
export function useSuccessToast() {
  const { showToast } = useToast()
  return useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }, [showToast])
}

export function useErrorToast() {
  const { showToast } = useToast()
  return useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }, [showToast])
}

export function useWarningToast() {
  const { showToast } = useToast()
  return useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }, [showToast])
}

export function useInfoToast() {
  const { showToast } = useToast()
  return useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }, [showToast])
}