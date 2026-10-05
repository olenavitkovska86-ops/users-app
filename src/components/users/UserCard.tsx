import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { User } from '../../types/user'
import RoleBadge from './RoleBadge'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  const initials = user.profile.name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase()
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-violet-300 hover:shadow-md focus-within:border-violet-300 focus-within:shadow-md motion-reduce:transition-none">
      <div className="flex items-center gap-4">
        <div aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-violet-700">
          {initials}
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
          <dd className="min-w-0 break-words">{user.profile.address.city}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Roller">
        {user.roles.map((role) => <RoleBadge key={role} role={role} />)}
      </div>
      <div className="mt-auto pt-5">
        <Link
          to={`/users/${user.id}`}
          aria-label={`Visa detaljer om ${user.profile.name}`}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 font-medium text-violet-700 transition-colors hover:bg-violet-50 focus:bg-violet-50 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600 motion-reduce:transition-none"
        >
          Visa detaljer
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  )
}
