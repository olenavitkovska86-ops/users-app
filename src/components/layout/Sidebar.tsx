import { LayoutDashboard, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center gap-3 text-lg font-semibold">
        <UsersRound aria-hidden="true" className="text-violet-600" size={24} />
        <span>Users App</span>
      </div>
      <nav aria-label="Huvudnavigation" className="mt-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-medium focus:outline-2 focus:outline-offset-2 focus:outline-violet-600 ${isActive ? 'bg-violet-100 text-violet-800' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard aria-hidden="true" size={20} />
              Översikt
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-medium focus:outline-2 focus:outline-offset-2 focus:outline-violet-600 ${isActive ? 'bg-violet-100 text-violet-800' : 'text-slate-600 hover:bg-slate-100'}`}
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
