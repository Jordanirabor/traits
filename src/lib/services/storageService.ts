import { LocalStoredData, SaveResult } from '@/types/common';
import { AnalysisResults } from '@/types/insights';
import { PersonalityData } from '@/types/personality';

/**
 * Storage service interface for personality data
 */
export interface StorageService {
  // Core operations
  savePersonalityData(data: PersonalityData): Promise<SaveResult>;
  loadPersonalityData(userId?: string): Promise<PersonalityData | null>;
  deletePersonalityData(userId?: string): Promise<SaveResult>;

  // Analysis results
  saveAnalysisResults(
    results: AnalysisResults,
    personalityId: string
  ): Promise<SaveResult>;
  loadAnalysisResults(personalityId: string): Promise<AnalysisResults | null>;

  // Migration
  migrateLocalToDatabase(userId: string): Promise<SaveResult>;

  // Utility
  isAvailable(): boolean;
  getStorageType(): 'database' | 'local';
}

/**
 * Database storage implementation for authenticated users
 */
export class DatabaseStorageService implements StorageService {
  constructor(private db: any) {}

  async savePersonalityData(data: PersonalityData): Promise<SaveResult> {
    try {
      const { db } = await import('@/lib/db');
      const { personalityProfiles } = await import('@/lib/db/schema');
      const { eq } = await import('drizzle-orm');

      if (!data.userId) {
        return {
          success: false,
          error: 'User ID required for database storage',
        };
      }

      // Check if profile exists
      const existingProfile = await db
        .select()
        .from(personalityProfiles)
        .where(eq(personalityProfiles.userId, data.userId))
        .limit(1);

      const profileData = {
        userId: data.userId,
        bigFive: data.bigFive || null,
        mbti: data.mbti || null,
        zodiac: data.zodiac || null,
        chineseZodiac: data.chineseZodiac || null,
        humanDesign: data.humanDesign || null,
        attachmentStyle: data.attachmentStyle || null,
        loveLanguages: data.loveLanguages || null,
        updatedAt: new Date(),
      };

      if (existingProfile.length > 0) {
        // Update existing profile
        await db
          .update(personalityProfiles)
          .set(profileData)
          .where(eq(personalityProfiles.userId, data.userId));
      } else {
        // Create new profile
        const profileId = `profile_${data.userId}_${Date.now()}`;
        await db.insert(personalityProfiles).values({
          id: profileId,
          ...profileData,
          createdAt: new Date(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Database save error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database save failed',
      };
    }
  }

  async loadPersonalityData(userId?: string): Promise<PersonalityData | null> {
    try {
      if (!userId) return null;

      const { db } = await import('@/lib/db');
      const { personalityProfiles } = await import('@/lib/db/schema');
      const { eq } = await import('drizzle-orm');

      const profiles = await db
        .select()
        .from(personalityProfiles)
        .where(eq(personalityProfiles.userId, userId))
        .limit(1);

      if (profiles.length === 0) return null;

      const profile = profiles[0];
      return {
        userId: profile.userId || undefined,
        timestamp: profile.updatedAt,
        bigFive: (profile.bigFive as any) || undefined,
        mbti: profile.mbti || undefined,
        zodiac: (profile.zodiac as any) || undefined,
        chineseZodiac: (profile.chineseZodiac as any) || undefined,
        humanDesign: (profile.humanDesign as any) || undefined,
        attachmentStyle: (profile.attachmentStyle as any) || undefined,
        loveLanguages: (profile.loveLanguages as any) || undefined,
      };
    } catch (error) {
      console.error('Database load error:', error);
      return null;
    }
  }

  async deletePersonalityData(userId?: string): Promise<SaveResult> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID required for database deletion',
        };
      }

      const { db } = await import('@/lib/db');
      const { personalityProfiles } = await import('@/lib/db/schema');
      const { eq } = await import('drizzle-orm');

      await db
        .delete(personalityProfiles)
        .where(eq(personalityProfiles.userId, userId));

      return { success: true };
    } catch (error) {
      console.error('Database delete error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Database delete failed',
      };
    }
  }

  async saveAnalysisResults(
    results: AnalysisResults,
    personalityId: string
  ): Promise<SaveResult> {
    try {
      const { db } = await import('@/lib/db');
      const { analysisResults } = await import('@/lib/db/schema');

      const resultId = `analysis_${personalityId}_${Date.now()}`;

      await db.insert(analysisResults).values({
        id: resultId,
        profileId: personalityId,
        selfImprovement: results.selfImprovement,
        strengths: results.strengths,
        greenFlags: results.greenFlags,
        redFlags: results.redFlags,
        confidence: results.confidence,
        completeness: results.completeness,
        createdAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error('Analysis results save error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis save failed',
      };
    }
  }

  async loadAnalysisResults(
    personalityId: string
  ): Promise<AnalysisResults | null> {
    try {
      const { db } = await import('@/lib/db');
      const { analysisResults } = await import('@/lib/db/schema');
      const { eq, desc } = await import('drizzle-orm');

      const results = await db
        .select()
        .from(analysisResults)
        .where(eq(analysisResults.profileId, personalityId))
        .orderBy(desc(analysisResults.createdAt))
        .limit(1);

      if (results.length === 0) return null;

      const result = results[0];
      return {
        selfImprovement: result.selfImprovement || [],
        strengths: result.strengths || [],
        greenFlags: result.greenFlags || [],
        redFlags: result.redFlags || [],
        confidence: result.confidence || 0,
        completeness: result.completeness || 0,
      };
    } catch (error) {
      console.error('Analysis results load error:', error);
      return null;
    }
  }

  async migrateLocalToDatabase(userId: string): Promise<SaveResult> {
    try {
      // Get local storage service to retrieve data
      const localService = new LocalStorageService();
      const localData = await localService.loadPersonalityData();

      if (!localData) {
        return { success: true }; // Nothing to migrate
      }

      // Save to database
      const dataWithUserId = { ...localData, userId };
      const saveResult = await this.savePersonalityData(dataWithUserId);

      if (saveResult.success) {
        // Clear local storage after successful migration
        await localService.deletePersonalityData();
      }

      return saveResult;
    } catch (error) {
      console.error('Migration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed',
      };
    }
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!process.env.DATABASE_URL;
  }

  getStorageType(): 'database' | 'local' {
    return 'database';
  }
}

/**
 * Local storage implementation for anonymous users
 */
export class LocalStorageService implements StorageService {
  private readonly STORAGE_KEY = 'personality-insights-data';
  private readonly STORAGE_VERSION = '1.0.0';

  async savePersonalityData(data: PersonalityData): Promise<SaveResult> {
    try {
      if (!this.isAvailable()) {
        return { success: false, error: 'Local storage not available' };
      }

      const existingData = this.getStoredData();
      const storedData: LocalStoredData = {
        version: this.STORAGE_VERSION,
        personalityData: data,
        analysisResults: existingData?.analysisResults,
        preferences: existingData?.preferences || {
          theme: 'system',
          notifications: true,
          dataRetention: 30,
        },
        metadata: {
          createdAt: existingData?.metadata.createdAt || new Date(),
          lastUpdated: new Date(),
          completionStatus: this.calculateCompletionStatus(data),
        },
      };

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(storedData, this.dateReplacer)
      );
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        return this.handleStorageQuotaExceeded(data);
      }

      console.error('Local storage save error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Local storage save failed',
      };
    }
  }

  async loadPersonalityData(): Promise<PersonalityData | null> {
    try {
      if (!this.isAvailable()) return null;

      const storedData = this.getStoredData();
      if (!storedData) return null;

      // Check if data has expired based on retention policy
      const retentionDays = storedData.preferences.dataRetention;
      const expirationDate = new Date(storedData.metadata.createdAt);
      expirationDate.setDate(expirationDate.getDate() + retentionDays);

      if (new Date() > expirationDate) {
        await this.deletePersonalityData();
        return null;
      }

      return storedData.personalityData;
    } catch (error) {
      console.error('Local storage load error:', error);
      return null;
    }
  }

  async deletePersonalityData(): Promise<SaveResult> {
    try {
      if (!this.isAvailable()) {
        return { success: false, error: 'Local storage not available' };
      }

      localStorage.removeItem(this.STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Local storage delete error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Local storage delete failed',
      };
    }
  }

  async saveAnalysisResults(results: AnalysisResults): Promise<SaveResult> {
    try {
      if (!this.isAvailable()) {
        return { success: false, error: 'Local storage not available' };
      }

      const existingData = this.getStoredData();
      if (!existingData) {
        return {
          success: false,
          error: 'No personality data found to associate with results',
        };
      }

      const updatedData: LocalStoredData = {
        ...existingData,
        analysisResults: results,
        metadata: {
          ...existingData.metadata,
          lastUpdated: new Date(),
        },
      };

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(updatedData, this.dateReplacer)
      );
      return { success: true };
    } catch (error) {
      console.error('Analysis results save error:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Analysis results save failed',
      };
    }
  }

  async loadAnalysisResults(): Promise<AnalysisResults | null> {
    try {
      const storedData = this.getStoredData();
      return storedData?.analysisResults || null;
    } catch (error) {
      console.error('Analysis results load error:', error);
      return null;
    }
  }

  async migrateLocalToDatabase(userId: string): Promise<SaveResult> {
    // This method is handled by DatabaseStorageService
    return { success: true };
  }

  isAvailable(): boolean {
    try {
      return (
        typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      );
    } catch {
      return false;
    }
  }

  getStorageType(): 'database' | 'local' {
    return 'local';
  }

  // Private helper methods
  private getStoredData(): LocalStoredData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      return JSON.parse(stored, this.dateReviver);
    } catch {
      return null;
    }
  }

  private calculateCompletionStatus(
    data: PersonalityData
  ): Record<string, boolean> {
    return {
      bigFive: !!data.bigFive,
      mbti: !!data.mbti,
      zodiac: !!data.zodiac,
      chineseZodiac: !!data.chineseZodiac,
      humanDesign: !!data.humanDesign,
      attachmentStyle: !!data.attachmentStyle,
      loveLanguages: !!data.loveLanguages && data.loveLanguages.length === 5,
    };
  }

  private handleStorageQuotaExceeded(data: PersonalityData): SaveResult {
    try {
      // Clear old analysis results to free up space
      const existingData = this.getStoredData();
      if (existingData) {
        const cleanedData: LocalStoredData = {
          ...existingData,
          analysisResults: undefined, // Remove analysis results to save space
          personalityData: data,
          metadata: {
            ...existingData.metadata,
            lastUpdated: new Date(),
          },
        };

        localStorage.setItem(
          this.STORAGE_KEY,
          JSON.stringify(cleanedData, this.dateReplacer)
        );
        return { success: true };
      }

      return {
        success: false,
        error: 'Storage quota exceeded and cleanup failed',
      };
    } catch {
      return { success: false, error: 'Storage quota exceeded' };
    }
  }

  // JSON serialization helpers for Date objects
  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  private dateReviver(key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  }
}

/**
 * Factory function to create appropriate storage service based on user authentication
 */
export const createStorageService = (
  isAuthenticated: boolean,
  userId?: string
): StorageService => {
  if (isAuthenticated && userId) {
    return new DatabaseStorageService(null); // db will be imported dynamically
  }
  return new LocalStorageService();
};

/**
 * Storage service manager that handles switching between storage types
 */
export class StorageServiceManager {
  private currentService: StorageService;

  constructor(isAuthenticated: boolean, userId?: string) {
    this.currentService = createStorageService(isAuthenticated, userId);
  }

  async switchToAuthenticated(userId: string): Promise<SaveResult> {
    const oldService = this.currentService;
    this.currentService = new DatabaseStorageService(null);

    // Migrate data from local to database
    return await this.currentService.migrateLocalToDatabase(userId);
  }

  switchToAnonymous(): void {
    this.currentService = new LocalStorageService();
  }

  getService(): StorageService {
    return this.currentService;
  }
}
