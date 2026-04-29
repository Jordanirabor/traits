import { getSession } from '@/lib/auth/session';
import { callN8nWebhook } from '@/lib/n8n';
import { extractFirstName } from '@/lib/utils/name';
import { PersonalityData } from '@/types/personality';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const personalityData: PersonalityData = await request.json();

    // Validate that we have at least some personality data
    const hasData =
      personalityData.bigFive ||
      personalityData.mbti ||
      personalityData.zodiac ||
      personalityData.chineseZodiac ||
      personalityData.humanDesign ||
      personalityData.attachmentStyle ||
      (personalityData.loveLanguages &&
        personalityData.loveLanguages.length > 0);

    if (!hasData) {
      return NextResponse.json(
        {
          error: 'No personality data provided',
          message: 'Please provide at least one personality trait',
        },
        { status: 400 }
      );
    }

    // Extract a friendly first name, falling back to email prefix
    const userName = session.user.name
      ? extractFirstName(session.user.name) || session.user.name
      : session.user.email?.split('@')[0] || 'User';

    const result = await callN8nWebhook(
      personalityData,
      userName,
      session.user.id
    );

    if (!result.success) {
      const status = result.error?.includes('timed out') ? 504 : 500;
      return NextResponse.json(
        { error: result.error || 'Failed to generate insights' },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      insights: result.insights,
      generatedAt: new Date().toISOString(),
      duration: result.duration,
    });
  } catch (error) {
    console.error('Insight generation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to generate insights',
      },
      { status: 500 }
    );
  }
}
