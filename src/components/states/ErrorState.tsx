export default function ErrorState() {
  return (
    <section role="alert" className="rounded-2xl border border-red-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Kunde inte hämta användarna</h2>
      <p className="mt-2 text-slate-600">Det gick inte att kontakta tjänsten. Försök igen senare.</p>
    </section>
  )
}
