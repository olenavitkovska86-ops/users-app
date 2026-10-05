import { useEffect, useState } from 'react'
import { CircleAlert } from 'lucide-react'
import { getUsersErrorMessage } from '../../lib/usersError'

interface ErrorStateProps {
  error: unknown
  onRetry: () => void
  isFetching: boolean
  retryAt: number
  hasCachedData?: boolean
}

export default function ErrorState({ error, onRetry, isFetching, retryAt, hasCachedData = false }: ErrorStateProps) {
  const [now, setNow] = useState(() => Date.now())
  const secondsRemaining = Math.max(0, Math.ceil((retryAt - now) / 1000))

  useEffect(() => {
    if (retryAt === 0) return
    const timer = window.setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)
      if (currentTime >= retryAt) window.clearInterval(timer)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [retryAt])

  return (
    <section role="alert" className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
      <CircleAlert aria-hidden="true" className="mb-3 text-red-600" size={26} />
      <h2 className="text-xl font-semibold">{hasCachedData ? 'Uppdateringen misslyckades' : 'Kunde inte hämta användarna'}</h2>
      <p className="mt-2 text-slate-600">{getUsersErrorMessage(error)}</p>
      {hasCachedData && <p className="mt-2 text-slate-600">Tidigare hämtade uppgifter visas fortfarande.</p>}
      {secondsRemaining > 0 && <p className="mt-2 text-sm text-slate-600">Försök igen om {secondsRemaining} sekunder.</p>}
      <button
        type="button"
        onClick={onRetry}
        disabled={isFetching || secondsRemaining > 0}
        className="mt-4 rounded-lg bg-violet-700 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-800 focus:bg-violet-800 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
      >
        {isFetching ? 'Hämtar…' : 'Försök igen'}
      </button>
    </section>
  )
}
