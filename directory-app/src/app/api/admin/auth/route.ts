import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'hamed9795';
const ADMIN_PASSWORD = '102067438Gerd.com';
const COOKIE_NAME = 'admin_session';
const COOKIE_VALUE = 'admin_authenticated_secret_token_2026';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
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
