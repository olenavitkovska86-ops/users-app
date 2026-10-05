import { UsersApiError } from '../api/users'

export function getUsersErrorMessage(error: unknown) {
  if (!(error instanceof UsersApiError)) return 'Något gick fel. Försök igen senare.'

  switch (error.kind) {
    case 'network':
      return 'Kontrollera din internetanslutning och försök igen.'
    case 'invalid-json':
      return 'Tjänstens svar kunde inte läsas. Försök igen senare.'
    case 'invalid-structure':
      return 'Tjänsten skickade ofullständiga eller oväntade användaruppgifter.'
    case 'http':
      if (error.status === 401) return 'Åtkomsten kunde inte bekräftas. Kontakta ansvarig för tjänsten.'
      if (error.status === 403) return 'Tjänsten tillåter inte åtkomst. Kontakta ansvarig för tjänsten.'
      if (error.status === 429) return 'För många förfrågningar. Vänta innan du försöker igen.'
      if (error.status !== undefined && error.status >= 500) return 'Tjänsten har ett tillfälligt problem. Försök igen senare.'
      return 'Tjänsten kunde inte hämta användarna. Försök igen senare.'
  }
}

export function getUsersRetryAt(error: unknown, errorUpdatedAt: number) {
  if (!(error instanceof UsersApiError) || error.status !== 429) return 0

  const retryAfter = error.retryAfter?.trim()
  if (retryAfter && /^\d+$/.test(retryAfter)) {
    const retryAt = errorUpdatedAt + Number(retryAfter) * 1000
    if (Number.isFinite(retryAt)) return retryAt
  } else if (retryAfter && /^[A-Za-z]/.test(retryAfter)) {
    const retryAt = Date.parse(retryAfter)
    if (Number.isFinite(retryAt)) return Math.max(errorUpdatedAt, retryAt)
  }

  return errorUpdatedAt + 60 * 1000
}
