import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function Dashboard({ user }: { user: User }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
      <p className="text-gray-600 mb-6">{user.email}</p>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  )
}