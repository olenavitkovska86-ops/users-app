import UserList from '../components/users/UserList'
import UserSearch from '../components/users/UserSearch'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import { useUsers } from '../hooks/useUsers'

export default function UsersPage() {
  const { data: users, isPending, error } = useUsers()
  const errorState = error ? <ErrorState /> : null

  if (isPending) return <LoadingState />
  if (!users) return errorState
  if (users.length === 0) return <>{errorState}<EmptyState /></>

  return (
    <div className="space-y-6">
      {errorState}
      <div>
        <h1 className="text-3xl font-semibold">Användare</h1>
        <p className="mt-2 text-slate-600">
          Visa användarkonton och öppna en användare för mer information.
        </p>
      </div>
      <UserSearch />
      <UserList users={users} />
    </div>
  )
}
