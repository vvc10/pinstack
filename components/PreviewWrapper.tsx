
'use client'

import { ReactNode } from 'react'
import ErrorBoundary from '@kombai/react-error-boundary'

interface PreviewWrapperProps {
  children: ReactNode
}

export default function PreviewWrapper({ children }: PreviewWrapperProps) {
  return (
    <ErrorBoundary>
      <div className="preview-container">
        {children}
      </div>
    </ErrorBoundary>
  )
}

