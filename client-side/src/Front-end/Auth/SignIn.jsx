import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function SignIn() {
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSignIn() {
    await signInWithGoogle()
    if (!isSupabaseConfigured) navigate('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-3xl font-bold text-brand-700 mb-1">Vatual Labs</div>
        <p className="text-slate-500 mb-8">Sign in to start your practicals</p>

        <button
          onClick={handleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-lg py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.5 29.6 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.5 29.6 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z"/>
            <path fill="#4CAF50" d="M24 44.5c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4c-2 1.4-4.6 2.3-7.6 2.3-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.9 16.2 44.5 24 44.5z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.6 5.4C41.6 35.8 44.5 30.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"/>
          </svg>
          Continue with Google
        </button>

        {!isSupabaseConfigured && (
          <p className="mt-6 text-xs text-slate-400">
            Demo mode - backend not connected yet, this creates a local demo session.
          </p>
        )}
      </div>
    </div>
  )
}
