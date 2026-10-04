import { UsersRound } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center gap-3 text-lg font-semibold">
        <UsersRound aria-hidden="true" className="text-violet-600" size={24} />
        <span>Users App</span>
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-violet-100 px-4 py-3 font-medium text-violet-800">
        <UsersRound aria-hidden="true" size={20} />
        <span>Användare</span>
      </div>
    </aside>
  )
}
