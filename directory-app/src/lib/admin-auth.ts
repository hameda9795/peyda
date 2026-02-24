import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

/**
 * Call this at the top of every admin API route handler.
 * Returns a 401 NextResponse if the request is not authenticated,
 * or null if the caller may proceed.
 *
 * @example
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAdminAuth();
 *   if (authError) return authError;
 *   // ... rest of handler
 * }
 */
export async function requireAdminAuth(): Promise<NextResponse | null> {
    const sessionValue = process.env.ADMIN_SESSION_VALUE;

    if (!sessionValue) {
        console.error('[admin-auth] ADMIN_SESSION_VALUE env var is not set');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const cookieStore = await cookies();
    const adminSession = cookieStore.get(ADMIN_COOKIE);

    if (!adminSession || adminSession.value !== sessionValue) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    return null; // auth OK — caller may proceed
}
