import { Link } from 'react-router-dom'
import RoleBadge from '../components/users/RoleBadge'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import { useUsers } from '../hooks/useUsers'

const statisticsLinkClass = 'flex items-center justify-between gap-4 rounded-xl px-3 py-3 text-violet-800 transition-colors hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 motion-reduce:transition-none'

export default function DashboardPage() {
  const { data: users, isPending, error, isFetching, isPaused, retryAt, retryUsers } = useUsers()
  const errorState = error ? (
    <ErrorState error={error} onRetry={retryUsers} isFetching={isFetching || isPaused} retryAt={retryAt} hasCachedData={users !== undefined} />
  ) : null

  if (isPending) return <LoadingState />
  if (!users) return errorState
  if (users.length === 0) return <>{errorState}<EmptyState /></>

  const roles = [...new Set(users.flatMap((user) => user.roles))]
  const lightThemeCount = users.filter((user) => user.settings.theme === 'light').length
  const darkThemeCount = users.filter((user) => user.settings.theme === 'dark').length
  const emailNotificationsCount = users.filter((user) => user.settings.notifications.email).length
  const pushNotificationsCount = users.filter((user) => user.settings.notifications.push).length

  return (
    <div className="space-y-6">
      {errorState}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Översikt</h1>
        <p className="mt-2 text-slate-600">Alla siffror beräknas från den hämtade användarlistan.</p>
      </div>
      <Link to="/users" className="block rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm hover:border-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
        <h2 className="text-lg font-semibold">Totalt antal användare</h2>
        <p className="mt-3 text-4xl font-semibold text-violet-700">{users.length}</p>
      </Link>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Användare per roll</h2>
          <p className="mt-2 text-sm text-slate-600">En användare kan ha flera roller.</p>
          <ul className="mt-4 space-y-1">
            {roles.map((role) => (
              <li key={role}>
                <Link to={`/users?role=${encodeURIComponent(role)}`} className={statisticsLinkClass}>
                  <RoleBadge role={role} />
                  <span className="font-semibold">{users.filter((user) => user.roles.includes(role)).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Valda teman</h2>
          <ul className="mt-4 space-y-1">
            <li><Link to="/users?theme=light" className={statisticsLinkClass}><span>Ljust</span><span className="font-semibold">{lightThemeCount}</span></Link></li>
            <li><Link to="/users?theme=dark" className={statisticsLinkClass}><span>Mörkt</span><span className="font-semibold">{darkThemeCount}</span></Link></li>
          </ul>
        </section>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Aktiverade aviseringar</h2>
        <p className="mt-2 text-sm text-slate-600">Antal användare med respektive avisering påslagen.</p>
        <ul className="mt-4 space-y-1">
          <li><Link to="/users?notification=email" className={statisticsLinkClass}><span>E-postaviseringar</span><span className="font-semibold">{emailNotificationsCount}</span></Link></li>
          <li><Link to="/users?notification=push" className={statisticsLinkClass}><span>Pushaviseringar</span><span className="font-semibold">{pushNotificationsCount}</span></Link></li>
        </ul>
      </section>
    </div>
  )
}
