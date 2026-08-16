import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

type Course = {
  id: number
  course_name: string
  instructor: string
  status: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [courseName, setCourseName] = useState('')
  const [instructor, setInstructor] = useState('')
  const [status, setStatus] = useState('enrolled')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCourses(data)
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchCourses()
  }, [user])

  const handleSubmit = async () => {
    if (!courseName.trim() || !instructor.trim()) return
    if (!user) return

    if (editingId) {
      await supabase.from('courses')
        .update({ course_name: courseName, instructor, status })
        .eq('id', editingId)
      setEditingId(null)
    } else {
      await supabase.from('courses').insert({
        course_name: courseName,
        instructor,
        status,
        user_id: user.id,
      })
    }

    setCourseName('')
    setInstructor('')
    setStatus('enrolled')
    fetchCourses()
  }

  const handleEdit = (course: Course) => {
    setEditingId(course.id)
    setCourseName(course.course_name)
    setInstructor(course.instructor)
    setStatus(course.status)
  }

  const handleDelete = async (id: number) => {
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setCourseName('')
    setInstructor('')
    setStatus('enrolled')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-300">
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <input type="text" placeholder="Course name" value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="text" placeholder="Instructor" value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="enrolled">Enrolled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleSubmit}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300">
              {editingId ? 'Update Course' : 'Add Course'}
            </button>
            {editingId && (
              <button onClick={handleCancelEdit}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-300">
                Cancel
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-center text-gray-500">Loading courses...</p>}
        {!loading && courses.length === 0 && (
          <p className="text-center text-gray-500">No courses yet. Add one above!</p>
        )}

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.course_name}</h3>
                  <p className="text-gray-500 text-sm">{course.instructor}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 capitalize">
                    {course.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(course)} className="text-sm text-indigo-600 font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete(course.id)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}