/**
 * Integration test for core data models and storage system
 * This test verifies that all components work together correctly
 */

import {
  calculateDataCompleteness,
  normalizePersonalityData,
  PersonalityData,
} from '@/types/personality';
import { LocalStorageService } from '../storageService';
import { ValidationService } from '../validation';

// Mock localStorage for testing
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  }),
};

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Core Data Models and Storage System Integration', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('Data Validation and Sanitization', () => {
    it('should validate and sanitize complete personality data', () => {
      const testData = {
        userId: 'test-user-123',
        timestamp: new Date(),
        bigFive: {
          openness: 75,
          conscientiousness: 60,
          extraversion: 80,
          agreeableness: 70,
          neuroticism: 40,
        },
        mbti: 'ENFP',
        attachmentStyle: 'secure',
        loveLanguages: [
          { type: 'quality-time', rank: 1 },
          { type: 'words-of-affirmation', rank: 2 },
          { type: 'physical-touch', rank: 3 },
          { type: 'acts-of-service', rank: 4 },
          { type: 'gifts', rank: 5 },
        ],
      };

      const validation = ValidationService.validatePersonalityData(testData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should handle invalid data gracefully', () => {
      const invalidData = {
        bigFive: {
          openness: 150, // Invalid: over 100
          conscientiousness: -10, // Invalid: under 0
        },
        mbti: 'INVALID', // Invalid MBTI type
        loveLanguages: [
          { type: 'quality-time', rank: 1 },
          { type: 'quality-time', rank: 2 }, // Invalid: duplicate type
        ],
      };

      const validation = ValidationService.validatePersonalityData(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Storage Service', () => {
    it('should save and load personality data from local storage', async () => {
      const storageService = new LocalStorageService();

      const testData: PersonalityData = {
        userId: 'test-user',
        timestamp: new Date(),
        bigFive: {
          openness: 75,
          conscientiousness: 60,
          extraversion: 80,
          agreeableness: 70,
          neuroticism: 40,
        },
        mbti: 'ENFP',
      };

      // Save data
      const saveResult = await storageService.savePersonalityData(testData);
      expect(saveResult.success).toBe(true);

      // Load data
      const loadedData = await storageService.loadPersonalityData();
      expect(loadedData).toBeTruthy();
      expect(loadedData?.mbti).toBe('ENFP');
      expect(loadedData?.bigFive?.openness).toBe(75);
    });

    it('should calculate data completeness correctly', () => {
      const partialData: PersonalityData = {
        timestamp: new Date(),
        bigFive: {
          openness: 75,
          conscientiousness: 60,
          extraversion: 80,
          agreeableness: 70,
          neuroticism: 40,
        },
        mbti: 'ENFP',
      };

      const completeness = calculateDataCompleteness(partialData);
      expect(completeness).toBe(29); // 2 out of 7 frameworks = ~29%
    });
  });

  describe('Data Transformation', () => {
    it('should normalize personality data correctly', () => {
      const rawData = {
        mbti: 'enfp', // Should be uppercase
        timestamp: undefined, // Should get current date
        bigFive: {
          openness: 75.7, // Should be rounded
          conscientiousness: 60,
          extraversion: 80,
          agreeableness: 70,
          neuroticism: 40,
        },
      };

      const normalized = normalizePersonalityData(rawData);
      expect(normalized.mbti).toBe('ENFP');
      expect(normalized.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should handle complete data workflow: validate -> sanitize -> store -> retrieve', async () => {
      const storageService = new LocalStorageService();

      // Step 1: Raw input data (potentially unsafe)
      const rawInput = {
        userId: 'test-user<script>alert("xss")</script>',
        bigFive: {
          openness: '75.5', // String that should be converted to number
          conscientiousness: 60,
          extraversion: 80,
          agreeableness: 70,
          neuroticism: 40,
        },
        mbti: 'enfp', // Lowercase that should be uppercase
      };

      // Step 2: Validate and sanitize
      const validation = ValidationService.validatePersonalityData(rawInput);
      expect(validation.isValid).toBe(true);

      // Step 3: Normalize data
      const normalizedData = normalizePersonalityData(rawInput);
      expect(normalizedData.userId).toBe('test-useralert("xss")'); // XSS removed
      expect(normalizedData.mbti).toBe('ENFP'); // Uppercase

      // Step 4: Store data
      const saveResult =
        await storageService.savePersonalityData(normalizedData);
      expect(saveResult.success).toBe(true);

      // Step 5: Retrieve and verify
      const retrievedData = await storageService.loadPersonalityData();
      expect(retrievedData).toBeTruthy();
      expect(retrievedData?.userId).not.toContain('<script>');
      expect(retrievedData?.mbti).toBe('ENFP');
    });
  });
});
