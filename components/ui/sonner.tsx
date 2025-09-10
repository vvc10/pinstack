"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
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
        },
        descriptionClassName: 'hidden',
        titleClassName: 'text-sm font-medium',
        classNames: {
          toast: 'min-h-0 h-auto py-2 px-4 rounded-full',
          title: 'text-sm font-medium m-0',
          description: 'hidden',
          actionButton: 'hidden',
          cancelButton: 'hidden',
          closeButton: 'hidden',
        }
      }}
      style={
        {
          "--normal-bg": "rgba(0, 0, 0, 0.9)",
          "--normal-text": "white",
          "--normal-border": "transparent",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
