import RoleBadge from '../components/users/RoleBadge'
import LoadingState from '../components/states/LoadingState'
import ErrorState from '../components/states/ErrorState'
import EmptyState from '../components/states/EmptyState'
import { useUsers } from '../hooks/useUsers'

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

  return (
    <div className="space-y-6">
      {errorState}
      <div>
        <h1 className="text-3xl font-semibold">Översikt</h1>
        <p className="mt-2 text-slate-600">Alla siffror beräknas från den hämtade användarlistan.</p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Totalt antal användare</h2>
        <p className="mt-3 text-4xl font-semibold text-violet-700">{users.length}</p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Användare per roll</h2>
          <p className="mt-2 text-sm text-slate-600">En användare kan ha flera roller.</p>
          <dl className="mt-4 space-y-3">
            {roles.map((role) => (
              <div key={role} className="flex items-center justify-between gap-4">
                <dt><RoleBadge role={role} /></dt>
                <dd className="font-semibold">{users.filter((user) => user.roles.includes(role)).length}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Valda teman</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between gap-4"><dt>Ljust</dt><dd>{lightThemeCount}</dd></div>
            <div className="flex justify-between gap-4"><dt>Mörkt</dt><dd>{darkThemeCount}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  )
}
