'use client'

import { ERROR_NOT_FOUND, ErrorPage } from "@/components/fallback"
import { useRouter } from "next/navigation"

export default function NotFound() {
  let router = useRouter();
  return (<ErrorPage errorType={ERROR_NOT_FOUND} onClick={(e) => router.replace('/')} />   )
}