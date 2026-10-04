import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-violet-50 text-slate-900 md:flex">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-white p-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-10 focus:outline-2 focus:outline-violet-600"
      >
        Hoppa till innehållet
      </a>
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main id="main-content" tabIndex={-1} className="p-4 focus:outline-none md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
