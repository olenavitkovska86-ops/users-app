import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import RoleBadge from '../components/users/RoleBadge'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import { useUsers } from '../hooks/useUsers'

export default function UserDetailsPage() {
  const { userId } = useParams()
  const { data: users, isPending, error } = useUsers()
  const errorState = error ? <ErrorState /> : null

  if (isPending) return <LoadingState />
  if (!users) return errorState
  if (users.length === 0) return <>{errorState}<EmptyState /></>

  const numericUserId = userId && /^\d+$/.test(userId) ? Number(userId) : NaN
  const user = Number.isSafeInteger(numericUserId)
    ? users.find((user) => user.id === numericUserId)
    : undefined

  return (
    <div className="space-y-6">
      {errorState}
      <Link
        to="/users"
        className="inline-flex items-center gap-2 rounded-lg font-medium text-violet-700 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-violet-600"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Tillbaka till användare
      </Link>
      {user ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="break-words text-3xl font-semibold">{user.profile.name}</h1>
          <dl className="mt-6 space-y-4">
            <div><dt className="font-medium">Användarnamn</dt><dd className="break-words">{user.username}</dd></div>
            <div><dt className="font-medium">E-post</dt><dd className="break-words">{user.profile.email}</dd></div>
            <div>
              <dt className="font-medium">Adress</dt>
              <dd>{user.profile.address.street}<br />{user.profile.address.zipCode} {user.profile.address.city}</dd>
            </div>
            <div>
              <dt className="font-medium">Roller</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {user.roles.map((role) => <RoleBadge key={role} role={role} />)}
              </dd>
            </div>
          </dl>
        </article>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Användaren hittades inte</h1>
          <p className="mt-2 text-slate-600">Det finns ingen användare med detta ID i användarlistan.</p>
        </section>
      )}
    </div>
  )
}
