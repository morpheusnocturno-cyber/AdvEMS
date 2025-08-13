import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (data: { token: string; user: User }) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (data) => set(() => ({ token: data.token, user: data.user })),
  clear: () => set({ token: null, user: null })
}))