import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const sessionValue = process.env.ADMIN_SESSION_VALUE;

        if (!adminEmail || !adminPassword || !sessionValue) {
            console.error('[admin/auth] Missing ADMIN_EMAIL, ADMIN_PASSWORD or ADMIN_SESSION_VALUE env vars');
            return NextResponse.json(
                { success: false, message: 'Serverconfiguratiefout' },
                { status: 500 }
            );
        }

        if (email === adminEmail && password === adminPassword) {
            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, sessionValue, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, message: 'Ongeldige gebruikersnaam of wachtwoord' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: 'Serverfout' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ success: true });
}
