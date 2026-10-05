import { LayoutDashboard, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-surface p-5 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center gap-3 text-lg font-semibold">
        <UsersRound aria-hidden="true" className="text-violet-600" size={24} />
        <span>Users App</span>
      </div>
      <nav aria-label="Huvudnavigation" className="mt-6">
        <ul className="grid grid-cols-2 gap-2 md:block md:space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors motion-reduce:transition-none focus:outline-2 focus:outline-offset-2 focus:outline-violet-600 ${isActive ? 'bg-violet-100 text-violet-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100 focus:bg-slate-100'}`}
            >
              <LayoutDashboard aria-hidden="true" size={20} />
              Översikt
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors motion-reduce:transition-none focus:outline-2 focus:outline-offset-2 focus:outline-violet-600 ${isActive ? 'bg-violet-100 text-violet-800 shadow-sm' : 'text-slate-600 hover:bg-slate-100 focus:bg-slate-100'}`}
            >
              <UsersRound aria-hidden="true" size={20} />
              Användare
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
