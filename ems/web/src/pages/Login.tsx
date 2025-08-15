import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useNavigate, useLocation } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const location = useLocation() as any

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.post('/auth/login', values)
      if (data.mfaRequired) {
        toast.success('MFA required. Please enter your code.')
        setMfaToken(data.tempToken)
        return
      }
      setAuth({ token: data.token, user: data.user })
      toast.success('Welcome back!')
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Login failed')
    }
  }

  const verifyMfa = async () => {
    try {
      const { data } = await api.post('/auth/mfa/verify', { code }, { headers: { Authorization: `Bearer ${mfaToken}` } })
      // we need user info; ask me endpoint
      const me = await api.get('/me', { headers: { Authorization: `Bearer ${data.token}` } })
      setAuth({ token: data.token, user: me.data.user })
      toast.success('MFA verified!')
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Invalid code')
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        {!mfaToken ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" {...register('password')} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button disabled={isSubmitting} className="w-full rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">Enter the 6-digit code from your authenticator app.</p>
            <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 tracking-widest text-center" />
            <button onClick={verifyMfa} className="w-full rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2">Verify</button>
          </div>
        )}
      </div>
    </div>
  )
}