// Individual insight structure (client-side analysis engine)
export interface Insight {
  id: string;
  title: string;
  description: string;
  explanation: string;
  actionable: string;
  confidence: number;
  sources: string[];
}

// Client-side analysis results structure
export interface AnalysisResults {
  selfImprovement: Insight[];
  strengths: Insight[];
  greenFlags: Insight[];
  redFlags: Insight[];
  confidence: number;
  completeness: number;
}

// n8n AI-generated insights (markdown or structured)
export interface N8nInsightsResponse {
  output?: string; // Markdown content from n8n
  // Fallback structured format
  selfImprovement?: N8nInsight[];
  strengths?: N8nInsight[];
  selfGreenFlags?: N8nInsight[];
  selfRedFlags?: N8nInsight[];
  partnerGreenFlags?: N8nInsight[];
  partnerRedFlags?: N8nInsight[];
}

export interface N8nInsight {
  title: string;
  content: string;
  reasoning?: string;
  action?: string;
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
