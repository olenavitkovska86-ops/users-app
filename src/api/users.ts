import type { User } from '../types/user'

const USERS_URL = 'https://api-userapi.onrender.com/api/users/getUsers'
const USERS_API_KEY = 'elev-hemlighet-2026'

type UsersApiErrorKind = 'network' | 'http' | 'invalid-json' | 'invalid-structure'

export class UsersApiError extends Error {
  readonly kind: UsersApiErrorKind
  readonly status: number | undefined
  readonly retryAfter: string | null

  constructor(kind: UsersApiErrorKind, status?: number, retryAfter: string | null = null) {
    super(`Users API error: ${kind}`)
    this.name = 'UsersApiError'
    this.kind = kind
    this.status = status
    this.retryAfter = retryAfter
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isUser(value: unknown): value is User {
  if (!isRecord(value) || !isRecord(value.profile) || !isRecord(value.settings)) return false

  const { profile, settings } = value
  if (!isRecord(profile.address) || !isRecord(settings.notifications)) return false

  return (
    typeof value.id === 'number' && Number.isFinite(value.id) &&
    typeof value.username === 'string' &&
    typeof profile.name === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.address.street === 'string' &&
    typeof profile.address.city === 'string' &&
    typeof profile.address.zipCode === 'string' &&
    (settings.theme === 'dark' || settings.theme === 'light') &&
    typeof settings.notifications.email === 'boolean' &&
    typeof settings.notifications.push === 'boolean' &&
    Array.isArray(value.roles) && value.roles.every((role: unknown) => typeof role === 'string')
  )
}

function rethrowIfAborted(error: unknown, signal?: AbortSignal) {
  signal?.throwIfAborted()
  if (isRecord(error) && error.name === 'AbortError') throw error
}

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  signal?.throwIfAborted()

  let response: Response
  try {
    response = await fetch(USERS_URL, {
      method: 'GET',
      headers: { 'x-api-key': USERS_API_KEY },
      signal,
    })
  } catch (error: unknown) {
    rethrowIfAborted(error, signal)
    throw new UsersApiError('network')
  }

  signal?.throwIfAborted()
  if (!response.ok) {
    throw new UsersApiError('http', response.status, response.headers.get('Retry-After'))
  }

  let data: unknown
  try {
    data = await response.json()
  } catch (error: unknown) {
    rethrowIfAborted(error, signal)
    if (error instanceof SyntaxError) throw new UsersApiError('invalid-json')
    throw new UsersApiError('network')
  }

  signal?.throwIfAborted()
  if (!Array.isArray(data) || !data.every(isUser)) {
    throw new UsersApiError('invalid-structure')
  }

  return data
}
