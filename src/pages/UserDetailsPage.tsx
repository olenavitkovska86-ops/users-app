import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import RoleBadge from '../components/users/RoleBadge'
import { demoUsers } from '../data/demoUsers'

export default function UserDetailsPage() {
  const { userId } = useParams()
  const numericUserId = userId && /^\d+$/.test(userId) ? Number(userId) : NaN
  const user = Number.isSafeInteger(numericUserId)
    ? demoUsers.find((user) => user.id === numericUserId)
    : undefined

  return (
    <div className="space-y-6">
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
          <p className="mt-2 text-sm text-slate-600">Fiktiv användare från demonstrationsdata.</p>
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
          <p className="mt-2 text-slate-600">Det finns ingen användare med detta ID i demonstrationsdata.</p>
        </section>
      )}
    </div>
  )
}
