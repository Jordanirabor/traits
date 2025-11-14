'use client';

import { getDataRetentionRecommendation } from '@/utils/contentModeration';
import { useState } from 'react';

interface PrivacySettingsProps {
  userAge?: number;
  currentSettings: {
    dataRetentionDays: number;
    shareAnalytics: boolean;
    parentalNotifications: boolean;
  };
  onSave: (settings: {
    dataRetentionDays: number;
    shareAnalytics: boolean;
    parentalNotifications: boolean;
  }) => void;
  onClose: () => void;
}

/**
 * Privacy settings component with age-appropriate options
 */
export default function PrivacySettings({
  userAge,
  currentSettings,
  onSave,
  onClose,
}: PrivacySettingsProps) {
  const [settings, setSettings] = useState(currentSettings);
  const isMinor = userAge !== undefined && userAge < 18;
  const recommendation = userAge
    ? getDataRetentionRecommendation(userAge)
    : null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-settings-title"
    >
      <div className="card-mobile max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2
                id="privacy-settings-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
              >
                Privacy Settings
              </h2>
              <p className="text-sm text-gray-600">
                {isMinor
                  ? 'Control how your data is used and stored. Ask a parent if you need help.'
                  : 'Customize your privacy preferences.'}
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

          {/* Data retention */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="data-retention"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Automatic Data Deletion
              </label>
              <p className="text-xs text-gray-600 mb-3">
                {isMinor
                  ? "Choose how long to keep your data before it's automatically deleted"
                  : 'Set how long to keep your data before automatic deletion'}
              </p>
            </div>

            <select
              id="data-retention"
              value={settings.dataRetentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dataRetentionDays: parseInt(e.target.value),
                })
              }
              className="input-touch"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="-1">Never (keep until I delete)</option>
            </select>

            {recommendation && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  {recommendation.message}
                </p>
              </div>
            )}
          </div>

          {/* Analytics */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label
                  htmlFor="share-analytics"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Anonymous Usage Analytics
                </label>
                <p className="text-xs text-gray-600">
                  {isMinor
                    ? 'Help us improve the app by sharing anonymous usage data (no personal info)'
                    : 'Share anonymous usage data to help improve the app'}
                </p>
              </div>
              <button
                id="share-analytics"
                role="switch"
                aria-checked={settings.shareAnalytics}
                onClick={() =>
                  setSettings({
                    ...settings,
                    shareAnalytics: !settings.shareAnalytics,
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  settings.shareAnalytics ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.shareAnalytics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Parental notifications (for minors only) */}
          {isMinor && (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="parental-notifications"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Parental Guidance Reminders
                  </label>
                  <p className="text-xs text-gray-600">
                    Show reminders to discuss insights with a parent or guardian
                  </p>
                </div>
                <button
                  id="parental-notifications"
                  role="switch"
                  aria-checked={settings.parentalNotifications}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      parentalNotifications: !settings.parentalNotifications,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    settings.parentalNotifications
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.parentalNotifications
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Privacy info */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Your Privacy Rights
            </h3>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Access your data at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Export your data in a readable format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Delete your data permanently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  {isMinor
                    ? 'Extra protections for users under 18'
                    : 'Control how your data is used'}
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary w-full sm:w-auto"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
