export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PersonalityData {
  bigFive?: BigFiveScores;
  mbti?: string;
  enneagram?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  humanDesign?: string;
  attachmentStyle?: string;
  loveLanguages?: string[]; // Ranked in order of preference
  dateOfBirth?: string;
}

const STORAGE_KEY = "personality_insights_data";

export const savePersonalityData = (data: PersonalityData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save personality data:", error);
  }
};

export const loadPersonalityData = (): PersonalityData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load personality data:", error);
    return null;
  }
};

export const clearPersonalityData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear personality data:", error);
  }
};
