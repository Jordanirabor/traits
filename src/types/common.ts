// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// Storage types
export interface LocalStoredData {
  version: string;
  personalityData: import('./personality').PersonalityData;
  analysisResults?: import('./insights').AnalysisResults;
  preferences: UserPreferences;
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    completionStatus: Record<string, boolean>;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dataRetention: number; // days
}

// Save result types
export interface SaveResult {
  success: boolean;
  error?: string;
}
