import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-3xl font-semibold">Sidan hittades inte</h1>
      <p className="mt-2 text-slate-600">Adressen leder inte till någon sida i appen.</p>
      <Link
        to="/dashboard"
        className="mt-5 inline-block rounded-lg font-medium text-violet-700 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-violet-600"
      >
        Till översikten
      </Link>
    </section>
  )
}
