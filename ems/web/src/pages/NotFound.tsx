import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-slate-500">Page not found</p>
        <Link to="/" className="inline-block rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2">Go home</Link>
      </div>
    </div>
  )
}