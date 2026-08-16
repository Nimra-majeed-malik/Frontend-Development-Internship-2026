import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from './supabaseClient'
import { Link } from 'react-router-dom'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setMessage('')
    setError('')
    const { error } = await supabase.auth.signUp({ email: data.email, password: data.password })
    if (error) setError(error.message)
    else setMessage('Registered! Please check your email to confirm, then log in.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

        <input type="email" placeholder="Email" {...register('email')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

        <input type="password" placeholder="Password" {...register('password')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50">
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}