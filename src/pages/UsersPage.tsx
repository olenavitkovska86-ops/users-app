import { useState } from 'react'
import UserList from '../components/users/UserList'
import UserSearch from '../components/users/UserSearch'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import { useUsers } from '../hooks/useUsers'
import { filterUsers } from '../lib/filterUsers'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const { data: users, isPending, error, isFetching, isPaused, retryAt, retryUsers } = useUsers()
  const errorState = error ? (
    <ErrorState error={error} onRetry={retryUsers} isFetching={isFetching || isPaused} retryAt={retryAt} hasCachedData={users !== undefined} />
  ) : null

  if (isPending) return <LoadingState />
  if (!users) return errorState
  if (users.length === 0) return <>{errorState}<EmptyState /></>

  const filteredUsers = filterUsers(users, search)

  return (
    <div className="space-y-6">
      {errorState}
      <div>
        <h1 className="text-3xl font-semibold">Användare</h1>
        <p className="mt-2 text-slate-600">
          Visa användarkonton och öppna en användare för mer information.
        </p>
      </div>
      <UserSearch value={search} onChange={setSearch} onClear={() => setSearch('')} />
      <p role="status" className="text-sm text-slate-600">
        Visar {filteredUsers.length} av {users.length} användare.
      </p>
      {filteredUsers.length > 0 ? <UserList users={filteredUsers} /> : (
        <EmptyState
          title="Inga sökresultat"
          message="Ingen användare matchar din sökning. Prova ett annat sökord eller rensa sökningen."
          headingLevel="h2"
        />
      )}
    </div>
  )
}
