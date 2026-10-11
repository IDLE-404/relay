// Demo only — real auth needs a server.
// Accounts and the session live in this browser (localStorage, or memory if storage is blocked).
// Passwords are never stored: only a random salt and SHA-256(salt + password).
import { storage } from '@/shared/storage'

export type User = {
  id: string
  name: string
  email: string | null
  kind: 'guest' | 'account'
  createdAt: string
}

type Account = { email: string; name: string; salt: string; passwordHash: string; id: string; createdAt: string }

export type FieldErrors = Partial<Record<'name' | 'email' | 'password', 'nameLength' | 'emailInvalid' | 'passwordShort'>>
export type AuthError = 'invalidCredentials' | 'emailTaken' | 'unsupported'
export type AuthResult = { ok: true; user: User } | { ok: false; error: AuthError }

const accountsKey = 'relay-accounts'
const sessionKey = 'relay-session'

const toHex = (bytes: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

const randomHex = (length: number) => toHex(crypto.getRandomValues(new Uint8Array(length)))

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const validate = (fields: { name?: string; email: string; password: string }, mode: 'signin' | 'signup') => {
  const errors: FieldErrors = {}
  if (mode === 'signup') {
    const name = (fields.name ?? '').trim()
    if (name.length < 2 || name.length > 40) errors.name = 'nameLength'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(fields.email))) errors.email = 'emailInvalid'
  if (fields.password.length < 8) errors.password = 'passwordShort'
  return errors
}

// crypto.subtle exists only in secure contexts (https or localhost).
const hashPassword = async (salt: string, password: string) => {
  const data = new TextEncoder().encode(salt + password)
  return toHex(await crypto.subtle.digest('SHA-256', data))
}

const readJson = <T>(key: string, fallback: T): T => {
  try {
    return JSON.parse(storage.get(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

const loadAccounts = () => readJson<Account[]>(accountsKey, [])

export const loadSession = () => readJson<User | null>(sessionKey, null)

export const saveSession = (user: User | null) =>
  user ? storage.set(sessionKey, JSON.stringify(user)) : storage.remove(sessionKey)

const toUser = (account: Account): User => ({
  id: account.id,
  name: account.name,
  email: account.email,
  kind: 'account',
  createdAt: account.createdAt,
})

export const createGuest = (): User => ({
  id: `guest-${randomHex(8)}`,
  name: 'Guest',
  email: null,
  kind: 'guest',
  createdAt: new Date().toISOString(),
})

export const signUpAccount = async (name: string, email: string, password: string): Promise<AuthResult> => {
  if (!crypto.subtle) return { ok: false, error: 'unsupported' }
  const normalized = normalizeEmail(email)
  const accounts = loadAccounts()
  if (accounts.some((account) => account.email === normalized)) return { ok: false, error: 'emailTaken' }

  const salt = randomHex(16)
  const account: Account = {
    id: `user-${randomHex(8)}`,
    name: name.trim(),
    email: normalized,
    salt,
    passwordHash: await hashPassword(salt, password),
    createdAt: new Date().toISOString(),
  }
  storage.set(accountsKey, JSON.stringify([...accounts, account]))
  return { ok: true, user: toUser(account) }
}

// Same answer for an unknown email and a wrong password, so the form doesn't reveal who has an account.
export const signInAccount = async (email: string, password: string): Promise<AuthResult> => {
  if (!crypto.subtle) return { ok: false, error: 'unsupported' }
  const account = loadAccounts().find((item) => item.email === normalizeEmail(email))
  const hash = await hashPassword(account?.salt ?? randomHex(16), password)
  if (!account || hash !== account.passwordHash) return { ok: false, error: 'invalidCredentials' }
  return { ok: true, user: toUser(account) }
}

// Only internal paths: "/console", not "https://…", "//evil.com" or "/\\evil.com" (browsers read it as "//").
export const safeNext = (next: string | null) =>
  next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : '/console'
