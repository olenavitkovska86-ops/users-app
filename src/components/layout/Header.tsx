import { ShieldCheck } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-5 md:px-8">
      <p className="font-semibold tracking-tight">Användarkonton</p>
      <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-sm text-violet-800">
        <ShieldCheck aria-hidden="true" size={16} />
        Skrivskyddad vy
      </span>
    </header>
  )
}
