'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Answer {
  questionNumber: number;
  selectedOptions: number[];
  isCorrect?: boolean;
  score?: number;
  aiFeedback?: string;
}

interface Question {
  questionNumber: number;
  questionText: string;
  options: string[];
  correctOptions: number[];
  marks: number;
}

interface Submission {
  id: number;
  studentName: string;
  status: string;
  aiScore: number | null;
  finalScore: number | null;
  finalGrade: string | null;
  submittedAt: string;
  assignment: {
    id: number;
    title: string;
    description: string;
    questions: Question[];
  };
  answers: Answer[];
}

export default function ViewSubmission() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/student/submissions/${submissionId}/details`);
      setSubmission(response.data);
    } catch (error: any) {
      console.error('Error fetching submission:', error);
      if (error.response?.status === 404) {
        alert('Submission not found');
        router.push('/student');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading submission details...</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Submission not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {submission.assignment.title}
              </h1>
              <p className="text-gray-600">{submission.assignment.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              {submission.finalScore !== null ? (
                <>
                  <p className="text-3xl font-bold text-green-600">
                    {submission.finalScore}
                  </p>
                  {submission.finalGrade && (
                    <p className="text-xl font-semibold text-gray-700">
                      Grade: {submission.finalGrade}
                    </p>
                  )}
                </>
              ) : submission.aiScore !== null ? (
                <p className="text-3xl font-bold text-blue-600">
                  {submission.aiScore}
                </p>
              ) : (
                <p className="text-gray-400">Not graded yet</p>
              )}
            </div>
          </div>
          <Link
            href="/student"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Student Portal
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Answers & Feedback</h2>
          
          {submission.answers.map((answer, idx) => {
            const question = submission.assignment.questions.find(
              (q) => q.questionNumber === answer.questionNumber
            );
            if (!question) return null;

            const isCorrect = answer.isCorrect ?? false;
            const studentAnswers = question.options.filter((_, idx) => 
              answer.selectedOptions.includes(idx)
            );
            const correctAnswers = question.options.filter((_, idx) => 
              question.correctOptions.includes(idx)
            );

            return (
              <div
                key={idx}
                className={`border rounded-lg p-6 ${
                  isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <span className="text-2xl text-green-600">✓</span>
                    ) : (
                      <span className="text-2xl text-red-600">✗</span>
                    )}
                    <span className="font-semibold text-lg text-gray-900">
                      Question {answer.questionNumber}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {answer.score || 0} / {question.marks} marks
                  </span>
                </div>

                <p className="text-gray-900 mb-4 text-lg">{question.questionText}</p>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIdx) => {
                    const isSelected = answer.selectedOptions.includes(optIdx);
                    const isCorrectOption = question.correctOptions.includes(optIdx);
                    
                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border ${
                          isCorrectOption
                            ? 'bg-green-100 border-green-300'
                            : isSelected
                            ? 'bg-red-100 border-red-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                          {isCorrectOption && (
                            <span className="ml-auto text-xs text-green-700 font-medium bg-green-200 px-2 py-1 rounded">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isSelected && !isCorrectOption && (
                            <span className="ml-auto text-xs text-red-700 font-medium bg-red-200 px-2 py-1 rounded">
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {answer.aiFeedback && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl">✨</span>
                      <p className="font-semibold text-purple-900">AI Feedback:</p>
                    </div>
                    <p className="text-purple-800 leading-relaxed">{answer.aiFeedback}</p>
                  </div>
                )}

                {!answer.aiFeedback && submission.status === 'submitted' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Feedback is being generated. Please check back soon!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/student"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Back to My Grades
          </Link>
        </div>
      </div>
    </div>
  );
}

