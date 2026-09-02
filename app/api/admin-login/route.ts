import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';

const SESSION_COOKIE = 'admin_token';
const SESSION_COOKIE_VALUE = 'authenticated';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Constant-time string comparison, to mitigate timing attacks
 * when checking the submitted username & password.
 */
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  // Fail closed: auth isn't usable without configured credentials.
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) {
    return NextResponse.json(
      { success: false, message: 'Autentificarea admin nu este configurată.' },
      { status: 500 }
    );
  }

  let body: { username?: unknown; password?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Cerere invalidă.' },
      { status: 400 }
    );
  }

  const { username, password } = body;
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return NextResponse.json(
      { success: false, message: 'Utilizatorul și parola sunt obligatorii.' },
      { status: 400 }
    );
  }

  const userOk = safeEqual(username, adminUser);
  const passOk = safeEqual(password, adminPass);

  if (!userOk || !passOk) {
    // Deliberately generic message — don't reveal which field was wrong.
    return NextResponse.json(
      { success: false, message: 'Credențiale incorecte.' },
      { status: 401 }
    );
  }

  // Credentials valid → set a secure, HttpOnly session cookie.
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, SESSION_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS in prod, still works on localhost in dev
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });

  return response;
}