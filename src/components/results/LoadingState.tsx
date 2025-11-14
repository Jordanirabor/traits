'use client';

import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated circles */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyzing Your Personality
        </h2>
        <p className="text-gray-600 mb-6">
          We&apos;re processing your assessment data and generating personalized
          insights...
        </p>

        {/* Loading steps */}
        <div className="space-y-3 text-left max-w-xs mx-auto">
          <LoadingStep text="Analyzing personality patterns" delay={0} />
          <LoadingStep text="Identifying strengths" delay={300} />
          <LoadingStep text="Detecting growth opportunities" delay={600} />
          <LoadingStep text="Generating relationship insights" delay={900} />
        </div>
      </div>
    </div>
  );
};

interface LoadingStepProps {
  text: string;
  delay: number;
}

const LoadingStep: React.FC<LoadingStepProps> = ({ text, delay }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`flex items-center gap-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
    >
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
};
