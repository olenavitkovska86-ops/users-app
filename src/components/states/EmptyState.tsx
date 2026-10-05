interface EmptyStateProps {
  title?: string
  message?: string
}

export default function EmptyState({ title = 'Inga användare', message = 'Tjänsten returnerade en tom användarlista.' }: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-slate-600">{message}</p>
    </section>
  )
}
