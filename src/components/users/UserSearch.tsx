import { Search } from 'lucide-react'

export default function UserSearch() {
  return (
    <div>
      <label htmlFor="user-search" className="mb-2 block text-sm font-medium">Sök användare</label>
      <div className="relative">
        <Search aria-hidden="true" className="absolute top-3 left-3 text-slate-500" size={20} />
        <input
          id="user-search"
          type="search"
          readOnly
          placeholder="Namn, användarnamn, e-post eller ort"
          aria-describedby="search-help"
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-violet-600"
        />
      </div>
      <p id="search-help" className="mt-2 text-sm text-slate-600">
        Sökfältet är en förhandsvisning. Sökning är inte aktiverad ännu.
      </p>
    </div>
  )
}
