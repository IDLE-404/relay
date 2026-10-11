import { createContext, useContext } from 'react'
import type { AuthResult, User } from './auth'

export type AuthContextValue = {
  user: User | null
  status: 'signedIn' | 'signedOut'
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>
  continueAsGuest: () => User
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
