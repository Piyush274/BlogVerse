'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error caught:', error)
  }, [error])

  // Generic error message that works for all routes
  const getErrorMessage = () => {
    if (error.message.includes('NotFound')) {
      return "The requested resource doesn't exist."
    }
    if (error.message.includes('NetworkError')) {
      return "Network connection failed. Please check your internet."
    }
    return "Something unexpected went wrong. We're working to fix it."
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-2xl">
        <ExclamationTriangleIcon className="h-5 w-5" />
        <AlertTitle className="text-lg">Oops! Something went wrong</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p className="text-base">{getErrorMessage()}</p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Button 
              size="sm" 
              onClick={() => reset()}
              className="min-w-[120px]"
            >
              Try Again
            </Button>
            
            <Link href="/" passHref>
              <Button 
                variant="outline" 
                size="sm"
                className="min-w-[120px]"
              >
                Go Home
              </Button>
            </Link>

            <Link href="/about" passHref>
              <Button 
                variant="ghost" 
                size="sm"
                className="min-w-[120px]"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}