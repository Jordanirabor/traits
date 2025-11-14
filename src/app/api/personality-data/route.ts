import { auth } from '@/lib/auth/auth';
import { DatabaseStorageService } from '@/lib/services/storageService';
import { PersonalityData } from '@/types/personality';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storageService = new DatabaseStorageService(null);
    const data = await storageService.loadPersonalityData(session.user.id);

    if (!data) {
      return NextResponse.json({ timestamp: new Date() } as PersonalityData, {
        status: 200,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error loading personality data:', error);
    return NextResponse.json(
      { error: 'Failed to load personality data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: PersonalityData = await request.json();

    // Ensure userId matches session
    data.userId = session.user.id;

    const storageService = new DatabaseStorageService(null);
    const result = await storageService.savePersonalityData(data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to save personality data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving personality data:', error);
    return NextResponse.json(
      { error: 'Failed to save personality data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storageService = new DatabaseStorageService(null);
    const result = await storageService.deletePersonalityData(session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete personality data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting personality data:', error);
    return NextResponse.json(
      { error: 'Failed to delete personality data' },
      { status: 500 }
    );
  }
}
