import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'

export default function StudentLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/app" className="text-lg font-bold text-brand-700 shrink-0">Vatual Labs</Link>
          <div className="flex items-center gap-4 text-sm min-w-0">
            <span className="text-slate-500 hidden sm:inline truncate">{user?.email}</span>
            <button onClick={signOut} className="text-slate-500 hover:text-slate-800 shrink-0">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
