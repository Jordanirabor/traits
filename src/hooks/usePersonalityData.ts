'use client';

import { PersonalityData, getFrameworkCompleteness } from '@/types/personality';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'guestPersonalityData'; // Updated to match guest mode key
const AUTO_SAVE_DELAY = 1000; // 1 second debounce

export const usePersonalityData = () => {
  const [data, setData] = useState<PersonalityData>({
    timestamp: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp string back to Date
        if (parsed.timestamp) {
          parsed.timestamp = new Date(parsed.timestamp);
        }
        setData(parsed);
      }
    } catch (error) {
      console.error('Failed to load personality data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-save with debounce
  const saveData = useCallback((newData: PersonalityData) => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error('Failed to save personality data:', error);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, []);

  // Update data with auto-save
  const updateData = useCallback(
    (updates: Partial<PersonalityData>) => {
      const newData = {
        ...data,
        ...updates,
        timestamp: new Date(),
      };
      setData(newData);

      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        saveData(newData);
      }, AUTO_SAVE_DELAY);

      setSaveTimeout(timeout);
    },
    [data, saveTimeout, saveData]
  );

  // Clear all data
  const clearData = useCallback(() => {
    const emptyData: PersonalityData = {
      timestamp: new Date(),
    };
    setData(emptyData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get completion status
  const completionStatus = getFrameworkCompleteness(data);

  // Calculate overall completion percentage
  const completionPercentage = Math.round(
    (Object.values(completionStatus).filter(Boolean).length / 7) * 100
  );

  return {
    data,
    updateData,
    clearData,
    isLoading,
    isSaving,
    completionStatus,
    completionPercentage,
  };
};
