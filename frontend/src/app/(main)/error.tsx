'use client'
import { ERROR_MISSING_DATA, ErrorPage } from "@/components/fallback"

 // Error components must be Client Components
 
export default function Error({error,reset,}: 
{ error: Error & { digest?: string }, reset: () => void }) 
{
  
  return (
    <ErrorPage errorType={ERROR_MISSING_DATA} onClick={() => {}}/>
  )
}