"use client"

import { toast as sonnerToast } from "sonner"

export function useMinimalToast() {
  const toast = {
    success: (message: string) => {
      sonnerToast.success(message, {
        duration: 3000,
        style: {
          background: 'rgba(34, 197, 94, 0.9)',
          color: 'white',
          borderRadius: '24px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
          backdropFilter: 'blur(10px)',
        }
      })
    },
    error: (message: string) => {
      sonnerToast.error(message, {
        duration: 3000,
        style: {
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          borderRadius: '24px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(10px)',
        }
      })
    },
    info: (message: string) => {
      sonnerToast.info(message, {
        duration: 3000,
        style: {
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          borderRadius: '24px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          backdropFilter: 'blur(10px)',
        }
      })
    },
    warning: (message: string) => {
      sonnerToast.warning(message, {
        duration: 3000,
        style: {
          background: 'rgba(245, 158, 11, 0.9)',
          color: 'white',
          borderRadius: '24px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          backdropFilter: 'blur(10px)',
        }
      })
    },
    default: (message: string) => {
      sonnerToast(message, {
        duration: 3000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          borderRadius: '24px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
        }
      })
    }
  }

  return toast
}
