'use client';

import { useState } from 'react';

interface AgeVerificationProps {
  onVerified: (age: number) => void;
  minAge?: number;
}

/**
 * Age verification component with age-appropriate messaging
 */
export default function AgeVerification({
  onVerified,
  minAge = 14,
}: AgeVerificationProps) {
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();

    // Validate year
    if (isNaN(year) || year < 1900 || year > currentYear) {
      setError('Please enter a valid birth year');
      return;
    }

    const age = currentYear - year;

    // Check minimum age
    if (age < minAge) {
      setError(
        `You must be at least ${minAge} years old to use this app. Please ask a parent or guardian for guidance.`
      );
      return;
    }

    // Check maximum reasonable age
    if (age > 120) {
      setError('Please enter a valid birth year');
      return;
    }

    onVerified(age);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-verification-title"
    >
      <div className="card-mobile max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2
              id="age-verification-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
            >
              Age Verification
            </h2>
            <p className="text-sm text-gray-600">
              To provide age-appropriate content and privacy protections, please
              verify your age.
            </p>
          </div>

          {/* Birth year input */}
          <div>
            <label
              htmlFor="birth-year"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What year were you born?
            </label>
            <input
              type="number"
              id="birth-year"
              name="birth-year"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="YYYY"
              min="1900"
              max={new Date().getFullYear()}
              className="input-touch"
              required
              aria-describedby={error ? 'age-error' : undefined}
              aria-invalid={error ? 'true' : 'false'}
            />
            {error && (
              <p
                id="age-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          {/* Privacy notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Privacy:</strong> We only use your birth year to determine
              your age group for appropriate content and privacy settings. We
              don't store your exact birthdate.
            </p>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>

          {/* Additional info */}
          <p className="text-xs text-gray-500 text-center">
            This app is designed for users aged {minAge} and above. If you're
            under {minAge}, please explore with a parent or guardian.
          </p>
        </form>
      </div>
    </div>
  );
}
