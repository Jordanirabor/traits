'use client';

import { useState } from 'react';

interface PrivacyNoticeProps {
  userAge?: number;
  onAccept: () => void;
  onDecline?: () => void;
}

/**
 * Age-appropriate privacy notice component
 * Shows enhanced privacy information for users under 18
 */
export default function PrivacyNotice({
  userAge,
  onAccept,
  onDecline,
}: PrivacyNoticeProps) {
  const [showFullNotice, setShowFullNotice] = useState(false);
  const isMinor = userAge !== undefined && userAge < 18;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-notice-title"
    >
      <div className="card-mobile max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h2
              id="privacy-notice-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
            >
              {isMinor ? 'Privacy Notice for Young Users' : 'Privacy Notice'}
            </h2>
            {isMinor && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> We've created a special privacy
                  notice for users under 18. Please read this with a parent or
                  guardian.
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              What You Should Know
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  Your personality data is stored {isMinor ? 'securely ' : ''}
                  on your device
                  {isMinor ? ' and never shared without permission' : ''}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  We don't collect personal information like your name or email
                  {isMinor ? ' unless you choose to create an account' : ''}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  You can delete your data at any time
                  {isMinor ? ' - just ask a parent to help if needed' : ''}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  These insights are for self-reflection, not medical advice
                  {isMinor
                    ? ' - talk to a trusted adult about what you learn'
                    : ''}
                </span>
              </li>
              {isMinor && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">ℹ</span>
                  <span>
                    We recommend discussing your results with a parent,
                    guardian, or school counselor
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Full notice toggle */}
          {!showFullNotice && (
            <button
              onClick={() => setShowFullNotice(true)}
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Read full privacy policy
            </button>
          )}

          {/* Full notice */}
          {showFullNotice && (
            <div className="space-y-3 text-sm text-gray-700 border-t pt-4">
              <h4 className="font-semibold text-gray-900">
                Detailed Privacy Information
              </h4>

              <div>
                <h5 className="font-medium text-gray-900 mb-1">
                  Data Collection
                </h5>
                <p>
                  We collect only the personality assessment data you provide.
                  This includes your responses to personality frameworks like
                  Big Five, MBTI, and others.{' '}
                  {isMinor &&
                    'For users under 18, we take extra care to protect this information and limit how it can be used.'}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-1">Data Storage</h5>
                <p>
                  Your data is stored locally in your browser's storage. If you
                  create an account, it's stored securely in our database with
                  encryption.{' '}
                  {isMinor &&
                    'We never share data from users under 18 with third parties.'}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-1">Data Usage</h5>
                <p>
                  We use your data only to generate personality insights for
                  you. We don't sell your data or use it for advertising.
                  {isMinor &&
                    ' For young users, we apply additional restrictions to ensure your information is used only for the intended purpose.'}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-1">Your Rights</h5>
                <p>
                  You have the right to access, modify, or delete your data at
                  any time.{' '}
                  {isMinor &&
                    "If you're under 18, you can ask a parent or guardian to help you exercise these rights."}
                </p>
              </div>

              {isMinor && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-yellow-900 mb-1">
                    For Parents and Guardians
                  </h5>
                  <p className="text-yellow-800">
                    If you have questions about how we protect your child's
                    privacy, or if you'd like to review or delete their data,
                    please contact us. We're committed to providing a safe
                    experience for young users.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            {onDecline && (
              <button
                onClick={onDecline}
                className="btn-secondary w-full sm:w-auto"
              >
                Decline
              </button>
            )}
            <button onClick={onAccept} className="btn-primary w-full sm:w-auto">
              {isMinor ? 'I Understand (with Parent/Guardian)' : 'I Understand'}
            </button>
          </div>

          {isMinor && (
            <p className="text-xs text-gray-500 text-center">
              By clicking "I Understand", you confirm that you've read this
              notice with a parent or guardian.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
