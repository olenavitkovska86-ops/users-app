import { Mail, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { User } from '../../types/user'
import RoleBadge from './RoleBadge'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <article className="h-full rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-violet-100 p-3 text-violet-700">
          <UserRound aria-hidden="true" size={24} />
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-lg font-semibold">{user.profile.name}</h2>
          <p className="break-words text-sm text-slate-600">@{user.username}</p>
        </div>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Mail aria-hidden="true" className="shrink-0 text-slate-500" size={18} />
          <dt className="sr-only">E-post</dt>
          <dd className="min-w-0 break-words">{user.profile.email}</dd>
        </div>
        <div className="flex items-start gap-3">
          <MapPin aria-hidden="true" className="shrink-0 text-slate-500" size={18} />
          <dt className="sr-only">Ort</dt>
          <dd>{user.profile.address.city}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Roller">
        {user.roles.map((role) => <RoleBadge key={role} role={role} />)}
      </div>
      <Link
        to={`/users/${user.id}`}
        aria-label={`Visa detaljer om ${user.profile.name}`}
        className="mt-5 inline-block rounded-lg font-medium text-violet-700 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-violet-600"
      >
        Visa detaljer
      </Link>
    </article>
  )
}
