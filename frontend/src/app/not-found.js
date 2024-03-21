'use client'

import ErrorComponent, { ERROR_NOT_FOUND } from "@/components/error"
import { useRouter } from "next/navigation"

export default function NotFound() {
  let router = useRouter();
  return (<ErrorComponent errorType={ERROR_NOT_FOUND} onClick={(e) => router.replace('/')} />   )
}