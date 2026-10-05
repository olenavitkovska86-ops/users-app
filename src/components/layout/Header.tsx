export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-5 md:px-8">
      <p className="font-medium">Användarkonton</p>
      <span className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800">
        Skrivskyddad vy
      </span>
    </header>
  )
}
