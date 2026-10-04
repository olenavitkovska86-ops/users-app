import { demoUsers } from '../data/demoUsers'
import RoleBadge from '../components/users/RoleBadge'

export default function DashboardPage() {
  const roles = [...new Set(demoUsers.flatMap((user) => user.roles))]
  const lightThemeCount = demoUsers.filter((user) => user.settings.theme === 'light').length
  const darkThemeCount = demoUsers.filter((user) => user.settings.theme === 'dark').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Översikt</h1>
        <p className="mt-2 text-slate-600">Alla siffror beräknas från demonstrationsdata.</p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Totalt antal användare</h2>
        <p className="mt-3 text-4xl font-semibold text-violet-700">{demoUsers.length}</p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Användare per roll</h2>
          <p className="mt-2 text-sm text-slate-600">En användare kan ha flera roller.</p>
          <dl className="mt-4 space-y-3">
            {roles.map((role) => (
              <div key={role} className="flex items-center justify-between gap-4">
                <dt><RoleBadge role={role} /></dt>
                <dd className="font-semibold">{demoUsers.filter((user) => user.roles.includes(role)).length}</dd>
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
