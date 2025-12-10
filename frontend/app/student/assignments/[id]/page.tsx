'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Question {
  questionNumber: number;
  questionText: string;
  options: string[];
  marks: number;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export default function StudentAssignment() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/student/assignments/${assignmentId}`);
      setAssignment(response.data);
      // Initialize answers
      const initialAnswers: Record<number, number[]> = {};
      response.data.questions.forEach((q: Question) => {
        initialAnswers[q.questionNumber] = [];
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (questionNumber: number, optionIndex: number) => {
    setAnswers((prev) => {
      const current = prev[questionNumber] || [];
      if (current.includes(optionIndex)) {
        return { ...prev, [questionNumber]: current.filter((i) => i !== optionIndex) };
      } else {
        return { ...prev, [questionNumber]: [...current, optionIndex] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('Please enter your name');
      return;
    }

    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionNumber, selectedOptions]) => ({
        questionNumber: parseInt(questionNumber),
        selectedOptions,
      }));

      await api.post(`/student/assignments/${assignmentId}/submit`, {
        studentName,
        answers: answersArray,
      });

      alert('Assignment submitted successfully!');
      router.push('/student');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!assignment) {
    return <div className="min-h-screen flex items-center justify-center">Assignment not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            <p className="text-gray-600">{assignment.description}</p>
            <Link href="/student" className="text-blue-600 hover:underline text-sm">
              ← Back to Assignments
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
              {assignment.questions.map((question) => (
                <div key={question.questionNumber} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">
                      Question {question.questionNumber}
                    </h3>
                    <span className="text-sm text-gray-500">{question.marks} marks</span>
                  </div>
                  <p className="text-gray-900 mb-4">{question.questionText}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(answers[question.questionNumber] || []).includes(optIdx)}
                          onChange={() => toggleAnswer(question.questionNumber, optIdx)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link
                href="/student"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

