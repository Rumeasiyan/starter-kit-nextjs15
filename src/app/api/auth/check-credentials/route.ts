import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auth } from '@/lib/auth/auth';

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: request.headers,
  });

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const credentialsProviders = await db.account.findMany({
      where: {
        userId,
        providerId: {
          in: ['credentials', 'credential'],
        },
      },
    });

    const hasCredentials = credentialsProviders.length > 0;

    return NextResponse.json({ hasCredentials });
  } catch (error) {
    console.error('Error checking credentials:', error);
    return NextResponse.json(
      { error: 'Failed to check credentials' },
      { status: 500 }
    );
  }
}
