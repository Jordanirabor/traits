'use client';

import { useState } from 'react';

interface DataManagementProps {
  userAge?: number;
  onExportData: () => void;
  onDeleteData: () => void;
  onClose: () => void;
}

/**
 * Data management component with age-appropriate controls
 * Provides simplified interface for users under 18
 */
export default function DataManagement({
  userAge,
  onExportData,
  onDeleteData,
  onClose,
}: DataManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const isMinor = userAge !== undefined && userAge < 18;

  const handleDeleteConfirm = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      onDeleteData();
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-management-title"
    >
      <div className="card-mobile max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2
                id="data-management-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
              >
                {isMinor ? 'Your Data & Privacy' : 'Data Management'}
              </h2>
              <p className="text-sm text-gray-600">
                {isMinor
                  ? 'Control your personal information. Ask a parent or guardian if you need help.'
                  : 'Manage your personality data and privacy settings.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Data overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              What Data We Have
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-medium text-blue-900">
                    Personality Data
                  </span>
                </div>
                <p className="text-xs text-blue-800">
                  Your assessment responses and generated insights
                </p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium text-green-900">
                    Preferences
                  </span>
                </div>
                <p className="text-xs text-green-800">
                  Your app settings and preferences
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              What You Can Do
            </h3>

            {/* Export data */}
            <button
              onClick={onExportData}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Download Your Data
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isMinor
                      ? 'Get a copy of all your information to keep or share with a parent'
                      : 'Export all your personality data and insights as a JSON file'}
                  </p>
                </div>
              </div>
            </button>

            {/* Delete data */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-4 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Delete All Data
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isMinor
                      ? 'Permanently remove all your information. This cannot be undone!'
                      : 'Permanently delete all your personality data and insights'}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {isMinor && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Need Help?</strong> If you're not sure what to do, ask a
                parent, guardian, or trusted adult for guidance.
              </p>
            </div>
          )}
        </div>

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white rounded-lg p-4 sm:p-6 flex items-center justify-center">
            <div className="max-w-md w-full space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Are You Sure?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will permanently delete all your personality data and
                  insights. This action cannot be undone.
                </p>
              </div>

              <div>
                <label
                  htmlFor="delete-confirm"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type "DELETE" to confirm:
                </label>
                <input
                  type="text"
                  id="delete-confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="input-touch"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                  className="btn-base bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
