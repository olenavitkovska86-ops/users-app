import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
  headingLevel?: 'h1' | 'h2'
}

export default function EmptyState({ title = 'Inga användare', message = 'Tjänsten returnerade en tom användarlista.', headingLevel = 'h1' }: EmptyStateProps) {
  const Heading = headingLevel
  return (
    <section className="rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm">
      <div className="mb-5 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-600">
        <SearchX aria-hidden="true" size={28} />
      </div>
      <Heading className="text-2xl font-semibold">{title}</Heading>
      <p className="mt-2 text-slate-600">{message}</p>
    </section>
  )
}
