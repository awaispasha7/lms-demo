'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Submission {
  id: number;
  studentName: string;
  status: string;
  aiScore: number | null;
  finalScore: number | null;
  finalGrade: string | null;
  answers: Array<{
    questionNumber: number;
    selectedOptions: number[];
    isCorrect?: boolean;
    score?: number;
    aiFeedback?: string;
  }>;
}

interface Question {
  questionNumber: number;
  questionText: string;
  options: string[];
  correctOptions: number[];
  rubric: string;
  marks: number;
}

interface Assignment {
  id: number;
  title: string;
  questions: Question[];
}

export default function GradeAssignment() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        api.get(`/teacher/assignments/${assignmentId}`),
        api.get(`/teacher/assignments/${assignmentId}/submissions`),
      ]);
      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
      if (submissionsRes.data.length > 0 && !selectedSubmission) {
        setSelectedSubmission(submissionsRes.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGrade = async () => {
    try {
      await api.post(`/teacher/assignments/${assignmentId}/auto-grade`);
      fetchData();
      alert('All submissions auto-graded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to auto-grade');
    }
  };

  const handleGenerateFeedback = async (submissionId: number) => {
    try {
      await api.post(`/teacher/submissions/${submissionId}/generate-feedback`);
      fetchData();
      alert('AI feedback generated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate feedback');
    }
  };

  const handleFinalize = async (submission: Submission) => {
    const finalScore = prompt('Enter final score (or leave blank to use AI score):', 
      submission.aiScore?.toString() || '');
    if (finalScore === null) return;

    const score = finalScore ? parseFloat(finalScore) : submission.aiScore;
    const grade = getGradeFromScore(score || 0);

    try {
      await api.post(`/teacher/submissions/${submission.id}/finalize`, {
        finalScore: score,
        finalGrade: grade,
      });
      fetchData();
      alert('Grade finalized!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to finalize grade');
    }
  };

  const getGradeFromScore = (score: number): string => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const submission = selectedSubmission
    ? submissions.find((s) => s.id === selectedSubmission)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grade: {assignment?.title}</h1>
              <Link href="/teacher" className="text-blue-600 hover:underline text-sm">
                ← Back to Assignments
              </Link>
            </div>
            <button
              onClick={handleAutoGrade}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Auto-Grade All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">Submissions ({submissions.length})</h2>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {submissions.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 ${
                      selectedSubmission === sub.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{sub.studentName}</p>
                        <p className="text-sm text-gray-500">{sub.status}</p>
                      </div>
                      <div className="text-right">
                        {sub.finalScore !== null ? (
                          <p className="font-semibold text-green-600">
                            {sub.finalScore} / {sub.finalGrade}
                          </p>
                        ) : sub.aiScore !== null ? (
                          <p className="font-semibold text-blue-600">{sub.aiScore}</p>
                        ) : (
                          <p className="text-gray-400">--</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submission ? (
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">{submission.studentName}</h2>
                  <div className="flex gap-2">
                    {submission.aiScore !== null && !submission.answers[0]?.aiFeedback && (
                      <button
                        onClick={() => handleGenerateFeedback(submission.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        ✨ Generate AI Feedback
                      </button>
                    )}
                    {submission.status !== 'graded' && (
                      <button
                        onClick={() => handleFinalize(submission)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Finalize Grade
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">AI Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {submission.aiScore !== null ? submission.aiScore : '--'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Final Score</p>
                    <p className="text-2xl font-bold text-green-600">
                      {submission.finalScore !== null ? submission.finalScore : '--'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {submission.finalGrade || '--'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                  {submission.answers.map((answer, idx) => {
                    const question = assignment?.questions.find(
                      (q) => q.questionNumber === answer.questionNumber
                    );
                    if (!question) return null;

                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 ${
                          answer.isCorrect
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {answer.isCorrect ? (
                              <span className="text-green-600 font-bold">✓</span>
                            ) : (
                              <span className="text-red-600 font-bold">✗</span>
                            )}
                            <span className="font-medium text-gray-900">
                              Question {answer.questionNumber}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {answer.score || 0} / {question.marks} marks
                          </span>
                        </div>

                        <p className="text-gray-900 mb-3">{question.questionText}</p>

                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optIdx) => {
                            const isSelected = answer.selectedOptions.includes(optIdx);
                            const isCorrect = question.correctOptions.includes(optIdx);
                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded ${
                                  isCorrect
                                    ? 'bg-green-100 border border-green-300'
                                    : isSelected
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <span>{option}</span>
                                  {isCorrect && (
                                    <span className="ml-auto text-xs text-green-700 font-medium">
                                      (Correct)
                                    </span>
                                  )}
                                  {isSelected && !isCorrect && (
                                    <span className="ml-auto text-xs text-red-700 font-medium">
                                      (Selected)
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {answer.aiFeedback && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded">
                            <p className="text-sm font-medium text-purple-900 mb-1">
                              ✨ AI Feedback:
                            </p>
                            <p className="text-sm text-purple-800">{answer.aiFeedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

