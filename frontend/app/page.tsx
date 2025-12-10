import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="text-center space-y-8 max-w-4xl w-full">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            LMS Demo
          </h1>
          <p className="text-2xl text-gray-700 font-medium">AI-Powered MCQ Grading System</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <Link
            href="/teacher"
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            👨‍🏫 Teacher Portal
          </Link>
          
          <Link
            href="/student"
            className="px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-lg font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            👨‍🎓 Student Portal
          </Link>
        </div>

        <div className="mt-16 p-8 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">AI Grading Flow</h2>
          <ol className="text-left space-y-4 text-gray-700">
            <li className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="font-bold text-2xl text-blue-600 mr-4 min-w-[30px]">1.</span>
              <span className="text-lg">Teacher creates MCQ assignment with rubric & answer keys</span>
            </li>
            <li className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="font-bold text-2xl text-blue-600 mr-4 min-w-[30px]">2.</span>
              <span className="text-lg">Student submits answers</span>
            </li>
            <li className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="font-bold text-2xl text-blue-600 mr-4 min-w-[30px]">3.</span>
              <span className="text-lg">System auto-grades by comparing answers</span>
            </li>
            <li className="flex items-start p-3 rounded-lg hover:bg-purple-50 transition-colors">
              <span className="font-bold text-2xl text-purple-600 mr-4 min-w-[30px]">4.</span>
              <span className="text-lg">
                <strong className="text-purple-600 font-bold">AI generates encouraging feedback</strong> for each question
              </span>
            </li>
            <li className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <span className="font-bold text-2xl text-blue-600 mr-4 min-w-[30px]">5.</span>
              <span className="text-lg">Teacher reviews and finalizes grades</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

