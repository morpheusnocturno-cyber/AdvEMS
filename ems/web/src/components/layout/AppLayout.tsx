import { Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors">
      <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur z-10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">EMS</div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}