export default function LoadingState() {
  return (
    <section role="status" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-medium text-slate-600">Hämtar användare…</p>
      <div aria-hidden="true" className="grid animate-pulse gap-4 motion-reduce:animate-none sm:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="space-y-4 rounded-xl bg-slate-50 p-5">
            <div className="size-12 rounded-2xl bg-slate-200" />
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  )
}
