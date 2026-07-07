import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

const AuthContext = createContext(null)

const DEMO_KEY = 'vatual_demo_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => listener.subscription.unsubscribe()
    }

    const stored = localStorage.getItem(DEMO_KEY)
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  async function signInWithGoogle() {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
      return
    }
    const demoUser = { id: 'demo', name: 'Demo Student', email: 'demo@vatuallabs.co.ke' }
    localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem(DEMO_KEY)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
