import studentsData from './data/students.json'
import StudentCard from './StudentCard'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Student Progress Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentsData.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App