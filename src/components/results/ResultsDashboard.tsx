'use client';

import { AnalysisResults } from '@/types/insights';
import React from 'react';
import { InsightSection } from './InsightSection';
import { LoadingState } from './LoadingState';

interface ResultsDashboardProps {
  results: AnalysisResults | null;
  isAnalyzing: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: () => void;
  onRegenerate?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  isAnalyzing,
  error,
  onRetry,
  onEdit,
  onRegenerate,
}) => {
  const [showRegenerateConfirm, setShowRegenerateConfirm] =
    React.useState(false);
  // Show loading state while analyzing
  if (isAnalyzing) {
    return <LoadingState />;
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full card-mobile shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Analysis Failed
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onRetry} className="btn-primary">
              Try Again
            </button>
            <button onClick={onEdit} className="btn-secondary">
              Edit Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (!results) {
    return null;
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Your Personality Insights
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Based on your personality assessment, we&apos;ve generated
            personalized insights to help you grow and thrive in relationships.
          </p>
          <div className="mt-4 flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 bg-green-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span className="text-gray-600">
                Confidence: {Math.round(results.confidence * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 bg-blue-500 rounded-full"
                aria-hidden="true"
              ></div>
              <span className="text-gray-600">
                Completeness: {results.completeness}%
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4">
            <button
              onClick={onEdit}
              className="text-sm text-primary-600 hover:text-primary-700 underline min-h-touch"
            >
              Edit your assessment
            </button>
            {onRegenerate && (
              <>
                <span className="hidden xs:inline text-gray-300">|</span>
                <button
                  onClick={() => setShowRegenerateConfirm(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 underline min-h-touch"
                >
                  Regenerate insights
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs sm:text-sm text-yellow-800">
            <strong>Note:</strong> These insights are for self-reflection and
            personal growth, not clinical diagnosis. If you&apos;re under 18,
            consider discussing these insights with a trusted adult.
          </p>
        </div>

        {/* Regenerate Confirmation Dialog */}
        {showRegenerateConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="regenerate-dialog-title"
          >
            <div className="card-mobile shadow-xl max-w-md w-full">
              <h3
                id="regenerate-dialog-title"
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
              >
                Regenerate Insights?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                This will analyze your personality data again and generate new
                insights. Your current insights will be replaced.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowRegenerateConfirm(false)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRegenerateConfirm(false);
                    onRegenerate?.();
                  }}
                  className="btn-primary w-full sm:w-auto"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Self-Improvement Section */}
          <InsightSection
            title="Areas for Growth"
            description="Opportunities to develop and improve"
            insights={results.selfImprovement}
            type="improvement"
            icon={
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />

          {/* Strengths Section */}
          <InsightSection
            title="Your Strengths"
            description="Natural talents and positive attributes"
            insights={results.strengths}
            type="strength"
            icon={
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
          />

          {/* Green Flags Section */}
          <InsightSection
            title="Green Flags to Seek"
            description="Positive qualities to look for in partners"
            insights={results.greenFlags}
            type="green-flag"
            icon={
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
          />

          {/* Red Flags Section */}
          <InsightSection
            title="Red Flags to Watch"
            description="Warning signs to be aware of"
            insights={results.redFlags}
            type="red-flag"
            icon={
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};
