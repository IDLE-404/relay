import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/auth'

// Not signed in → /signin?next=<where they wanted to go>. The sign-in page sends them back.
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const { pathname, search, hash } = useLocation()

  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(pathname + search + hash)}`} replace />
  return children
}

export default RequireAuth
