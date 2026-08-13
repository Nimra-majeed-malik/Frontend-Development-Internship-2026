type Student = {
  id: number
  name: string
  completedCourses: string[]
  pendingCourses: string[]
  progress: number
}

export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{student.progress}% complete</p>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${student.progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-gray-700 mb-1">✅ Completed ({student.completedCourses.length})</p>
          <ul className="text-gray-600 space-y-1">
            {student.completedCourses.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-1">⏳ Pending ({student.pendingCourses.length})</p>
          <ul className="text-gray-600 space-y-1">
            {student.pendingCourses.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}