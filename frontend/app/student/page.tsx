'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
}

interface Submission {
  id: number;
  assignmentId: number;
  studentName: string;
  status: string;
  aiScore: number | null;
  finalScore: number | null;
  finalGrade: string | null;
  assignmentTitle: string;
}

export default function StudentPortal() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'grades'>('assignments');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/student/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!studentName.trim()) {
      alert('Please enter your name to view grades');
      return;
    }

    try {
      const response = await api.get(`/student/submissions?studentName=${encodeURIComponent(studentName)}`);
      setSubmissions(response.data);
      setActiveTab('grades');
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Error loading your grades. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
          <p className="text-gray-600 mt-2">View assignments, submit work, and check your grades</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'grades'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Grades
            </button>
          </nav>
        </div>

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <>
            {loading ? (
              <div className="text-center py-12">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">No assignments available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {assignment.description || 'No description'}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Due: {new Date(assignment.dueDate).toLocaleString()}
                    </p>
                    <Link
                      href={`/student/assignments/${assignment.id}`}
                      className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      View & Submit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">View Your Grades</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={fetchSubmissions}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  View Grades
                </button>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">
                  {studentName ? 'No submissions found. Enter your name and click "View Grades".' : 'Enter your name above to view your grades and feedback.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.assignmentTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Status: <span className={`font-medium ${
                            submission.status === 'graded' ? 'text-green-600' :
                            submission.status === 'submitted' ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        {submission.finalScore !== null ? (
                          <>
                            <p className="text-2xl font-bold text-green-600">
                              {submission.finalScore}
                            </p>
                            {submission.finalGrade && (
                              <p className="text-lg font-semibold text-gray-700">
                                Grade: {submission.finalGrade}
                              </p>
                            )}
                          </>
                        ) : submission.aiScore !== null ? (
                          <p className="text-2xl font-bold text-blue-600">
                            {submission.aiScore}
                          </p>
                        ) : (
                          <p className="text-gray-400">Not graded</p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/student/submissions/${submission.id}`}
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      View Details & Feedback
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

