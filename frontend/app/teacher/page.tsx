'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Assignment {
  id: number;
  title: string;
  description: string;
  totalSubmissions: number;
  gradedCount: number;
  pendingCount: number;
}

export default function TeacherPortal() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchAssignments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/teacher/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
            <p className="text-gray-600 mt-2">Manage assignments and grade submissions</p>
          </div>
          <Link
            href="/teacher/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Create Assignment
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No assignments yet.</p>
            <Link
              href="/teacher/create"
              className="text-blue-600 hover:underline font-semibold"
            >
              Create your first assignment →
            </Link>
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
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Submissions:</span>
                    <span className="font-semibold">{assignment.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Graded:</span>
                    <span className="font-semibold text-green-600">{assignment.gradedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-semibold text-orange-600">{assignment.pendingCount}</span>
                  </div>
                </div>

                <Link
                  href={`/teacher/assignments/${assignment.id}/grade`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Grade Now
                </Link>
              </div>
            ))}
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

