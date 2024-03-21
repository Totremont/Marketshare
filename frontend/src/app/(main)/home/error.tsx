'use client'
import ErrorComponent, { ERROR_MISSING_DATA } from "@/components/error"

 // Error components must be Client Components
 
export default function Error({error,reset,}: 
{ error: Error & { digest?: string }, reset: () => void }) 
{
  
  return (
    <ErrorComponent errorType={ERROR_MISSING_DATA} onClick={() => {}}/>
  )
}