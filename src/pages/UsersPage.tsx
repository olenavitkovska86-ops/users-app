import { useSearchParams } from 'react-router-dom'
import UserList from '../components/users/UserList'
import UserSearch from '../components/users/UserSearch'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import { useUsers } from '../hooks/useUsers'
import { filterUsers } from '../lib/filterUsers'
import { selectUsers, getActiveUserFilters, clearUserFilters } from '../lib/userFilters'

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  function setSearch(value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set('q', value)
      else next.delete('q')
      return next
    }, { replace: true })
  }
  const { data: users, isPending, error, isFetching, isPaused, retryAt, retryUsers } = useUsers()
  const errorState = error ? (
    <ErrorState error={error} onRetry={retryUsers} isFetching={isFetching || isPaused} retryAt={retryAt} hasCachedData={users !== undefined} />
  ) : null

  if (isPending) return <LoadingState />
  if (!users) return errorState
  if (users.length === 0) return <>{errorState}<EmptyState /></>

  const activeFilters = getActiveUserFilters(searchParams)
  const filteredUsers = filterUsers(selectUsers(users, searchParams), search)

  function clearFilters() {
    setSearchParams((current) => clearUserFilters(current))
  }

  return (
    <div className="space-y-6">
      {errorState}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Användare</h1>
        <p className="mt-2 text-slate-600">
          Visa användarkonton och öppna en användare för mer information.
        </p>
      </div>
      <UserSearch value={search} onChange={setSearch} onClear={() => setSearch('')} />
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <p className="text-sm text-violet-900">Aktivt filter: {activeFilters.join(' · ')}</p>
          <button type="button" onClick={clearFilters} className="rounded-lg px-3 py-2 font-medium text-violet-700 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
            Rensa filter
          </button>
        </div>
      )}
      <p role="status" className="text-sm text-slate-600">
        Visar {filteredUsers.length} av {users.length} användare.
      </p>
      {filteredUsers.length > 0 ? <UserList users={filteredUsers} /> : (
        <EmptyState
          title="Inga sökresultat"
          message="Ingen användare matchar din sökning eller ditt filter. Prova ett annat sökord eller rensa sökningen och filtret."
          headingLevel="h2"
        />
      )}
    </div>
  )
}
