import { Search } from 'lucide-react'

interface UserSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export default function UserSearch({ value, onChange, onClear }: UserSearchProps) {
  return (
    <div>
      <label htmlFor="user-search" className="mb-2 block text-sm font-medium">Sök användare</label>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search aria-hidden="true" className="absolute top-3 left-3 text-slate-500" size={20} />
          <input
            id="user-search"
            type="search"
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="Namn, användarnamn, e-post eller ort"
            aria-describedby="search-help"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-violet-600"
          />
        </div>
        {value !== '' && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-2 font-medium text-violet-700 hover:bg-violet-100 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600"
          >
            Rensa sökning
          </button>
        )}
      </div>
      <p id="search-help" className="mt-2 text-sm text-slate-600">
        Sök efter namn, användarnamn, e-post eller ort i den hämtade listan.
      </p>
    </div>
  )
}
