// Individual insight structure
export interface Insight {
  id: string;
  title: string;
  description: string;
  explanation: string;
  actionable: string;
  confidence: number;
  sources: string[];
}

// Analysis results structure
export interface AnalysisResults {
  selfImprovement: Insight[];
  strengths: Insight[];
  greenFlags: Insight[];
  redFlags: Insight[];
  confidence: number;
  completeness: number;
}

// Completeness report
export interface CompletenessReport {
  overall: number; // 0-100
  frameworks: Record<string, number>;
  missingFrameworks: string[];
  recommendations: string[];
}

// Compatibility score (for future relationship analysis)
export interface CompatibilityScore {
  overall: number; // 0-100
  attachmentCompatibility: number;
  personalityCompatibility: number;
  insights: Insight[];
}
