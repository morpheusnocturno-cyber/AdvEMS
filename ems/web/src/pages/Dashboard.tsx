import { useAuthStore } from '../store/authStore'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState<any[]>([])

  const refresh = async () => {
    try {
      const { data } = await api.get('/attendance/me')
      setEntries(data.entries)
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? 'Failed to load attendance')
    }
  }

  useEffect(() => { refresh() }, [])

  const getCoords = (): Promise<{ latitude?: number; longitude?: number }> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) return resolve({})
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve({}),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    })
  }

  const onClockIn = async () => {
    setLoading(true)
    try {
      const coords = await getCoords()
      await api.post('/attendance/clock-in', coords)
      toast.success('Clocked in')
      refresh()
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? 'Failed to clock in')
    } finally {
      setLoading(false)
    }
  }

  const onClockOut = async () => {
    setLoading(true)
    try {
      const coords = await getCoords()
      await api.post('/attendance/clock-out', coords)
      toast.success('Clocked out')
      refresh()
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? 'Failed to clock out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Welcome, {user?.name ?? 'Employee'}</h2>
      <div className="flex gap-3">
        <button onClick={onClockIn} disabled={loading} className="rounded-md bg-emerald-600 text-white px-4 py-2">Clock In</button>
        <button onClick={onClockOut} disabled={loading} className="rounded-md bg-rose-600 text-white px-4 py-2">Clock Out</button>
      </div>
      <div>
        <h3 className="font-medium mb-2">Recent Attendance</h3>
        <div className="space-y-2">
          {entries.slice(0,5).map((e) => (
            <div key={e.id} className="text-sm text-slate-600 dark:text-slate-300">
              In: {new Date(e.clockIn).toLocaleString()} {e.clockOut ? `• Out: ${new Date(e.clockOut).toLocaleString()}` : '• Ongoing'}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="font-medium">Leave</div>
          <div className="text-sm text-slate-500">Request and track leave</div>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="font-medium">Payslips</div>
          <div className="text-sm text-slate-500">View and download payslips</div>
        </div>
      </div>
    </div>
  )
}