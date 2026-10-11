import { useState, type ReactNode } from 'react'
import { createGuest, loadSession, saveSession, signInAccount, signUpAccount, type AuthResult, type User } from './auth'
import { AuthContext } from './AuthContext'

// A short pause so the loading state is visible, like a real request.
const delay = () => new Promise((resolve) => setTimeout(resolve, 400))

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadSession)

  const start = (next: User) => {
    saveSession(next)
    setUser(next)
    return next
  }

  const finish = (result: AuthResult) => {
    if (result.ok) start(result.user)
    return result
  }

  const value = {
    user,
    status: user ? ('signedIn' as const) : ('signedOut' as const),
    signIn: async (email: string, password: string) => {
      await delay()
      return finish(await signInAccount(email, password))
    },
    signUp: async (name: string, email: string, password: string) => {
      await delay()
      return finish(await signUpAccount(name, email, password))
    },
    continueAsGuest: () => start(createGuest()),
    // Ends the session; saved accounts stay.
    signOut: () => {
      saveSession(null)
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
