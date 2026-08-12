import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {user ? (
        <Dashboard user={user} />
      ) : showLogin ? (
        <Login onSwitch={() => setShowLogin(false)} />
      ) : (
        <Register onSwitch={() => setShowLogin(true)} />
      )}
    </div>
  )
}

export default App