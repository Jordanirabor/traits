'use client';

import { analysisEngine } from '@/lib/services/analysisEngine';
import { AnalysisResults } from '@/types/insights';
import { PersonalityData } from '@/types/personality';
import { useCallback, useEffect, useState } from 'react';

interface UseAnalysisOptions {
  data: PersonalityData;
  autoGenerate?: boolean;
  delay?: number;
}

export const useAnalysis = ({
  data,
  autoGenerate = true,
  delay = 1500,
}: UseAnalysisOptions) => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = useCallback(() => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate analysis delay for better UX
      setTimeout(() => {
        try {
          const analysisResults = analysisEngine.generateInsights(data);
          setResults(analysisResults);
          setIsAnalyzing(false);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to generate insights'
          );
          setIsAnalyzing(false);
        }
      }, delay);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate insights'
      );
      setIsAnalyzing(false);
    }
  }, [data, delay]);

  useEffect(() => {
    if (autoGenerate && data) {
      generateInsights();
    }
  }, [autoGenerate, data, generateInsights]);

  const regenerate = useCallback(() => {
    generateInsights();
  }, [generateInsights]);

  return {
    results,
    isAnalyzing,
    error,
    regenerate,
  };
};
