import { PersonalityData } from '@/types/personality';
import jwt from 'jsonwebtoken';

const N8N_JWT_PASSPHRASE = process.env.N8N_JWT_PASSPHRASE || '';
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  'https://n8n.scrambledsolutions.com/webhook/traits-explorer';
const N8N_TIMEOUT = 180000; // 3 minutes

/**
 * Generate JWT token for n8n webhook authentication.
 * Uses an empty payload signed with HS256 as n8n expects.
 */
export function generateN8nToken(): string {
  if (!N8N_JWT_PASSPHRASE) {
    throw new Error('N8N_JWT_PASSPHRASE environment variable is not set');
  }

  return jwt.sign({}, N8N_JWT_PASSPHRASE, { algorithm: 'HS256' });
}

/**
 * Transform the app's PersonalityData into the format n8n expects.
 */
export function transformToN8nFormat(
  personalityData: PersonalityData,
  userName: string
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    user_name: userName,
  };

  if (personalityData.mbti) {
    payload.mbti = personalityData.mbti;
  }

  if (personalityData.bigFive) {
    payload.big_five = {
      openness: personalityData.bigFive.openness || 0,
      conscientiousness: personalityData.bigFive.conscientiousness || 0,
      extraversion: personalityData.bigFive.extraversion || 0,
      agreeableness: personalityData.bigFive.agreeableness || 0,
      emotional_sensitivity: personalityData.bigFive.neuroticism || 0,
    };
  }

  if (personalityData.attachmentStyle) {
    payload.attachment_style = personalityData.attachmentStyle;
  }

  if (
    personalityData.loveLanguages &&
    personalityData.loveLanguages.length > 0
  ) {
    payload.love_languages = personalityData.loveLanguages
      .sort((a, b) => a.rank - b.rank)
      .map((l) => l.type);
  }

  if (personalityData.zodiac?.sun) {
    payload.zodiac_sign = personalityData.zodiac.sun;
  }

  if (personalityData.humanDesign?.type) {
    payload.human_design = personalityData.humanDesign.type;
  }

  if (personalityData.chineseZodiac?.animal) {
    payload.chinese_zodiac = personalityData.chineseZodiac.animal;
  }

  return payload;
}

/**
 * Call the n8n webhook with personality data and return the AI-generated insights.
 * Returns the raw n8n response (typically `{ output: "# Markdown..." }`).
 */
export async function callN8nWebhook(
  personalityData: PersonalityData,
  userName: string,
  userId: string
): Promise<{
  success: boolean;
  insights?: Record<string, unknown>;
  duration?: string;
  error?: string;
}> {
  const startTime = Date.now();

  const n8nPayload = {
    ...transformToN8nFormat(personalityData, userName),
    userId,
    userName,
  };

  const jwtToken = generateN8nToken();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(n8nPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[n8n] Webhook error: ${response.status} ${errorText}`);
      return {
        success: false,
        error: `n8n returned error: ${response.status}`,
      };
    }

    const n8nResponse = (await response.json()) as Record<string, unknown>;
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    return {
      success: true,
      insights: n8nResponse,
      duration: `${duration}s`,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error:
          'Request timed out. Insight generation took longer than expected.',
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to connect to insight generation service',
    };
  }
}
