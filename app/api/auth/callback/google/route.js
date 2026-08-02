import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req) {
  const timestamp = new Date().toISOString();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log(`[${timestamp}] [OAuth Callback] Received callback`);

  // Handle user denying consent
  if (error) {
    console.warn(`[${timestamp}] [OAuth Callback] User denied consent: ${error}`);
    return NextResponse.redirect(new URL(`/connections?error=${error}`, req.url));
  }

  if (!code) {
    console.error(`[${timestamp}] [OAuth Callback] No authorization code present`);
    return NextResponse.redirect(new URL('/connections?error=no_code', req.url));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/callback/google`;

    if (!clientId || !clientSecret) {
      console.error(`[${timestamp}] [OAuth Callback] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET`);
      return NextResponse.redirect(new URL('/connections?error=missing_credentials', req.url));
    }

    console.log(`[${timestamp}] [OAuth Callback] Exchanging code for tokens...`);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error(`[${timestamp}] [OAuth Callback] Token exchange failed:`, tokenData.error, tokenData.error_description);
      return NextResponse.redirect(new URL(`/connections?error=${tokenData.error}`, req.url));
    }

    console.log(`[${timestamp}] [OAuth Callback] Token exchange successful! access_token present: ${!!tokenData.access_token}`);

    // Store access token securely in an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('google_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600,
      path: '/',
    });

    if (tokenData.refresh_token) {
      cookieStore.set('google_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    // Redirect to Dashboard with success status
    return NextResponse.redirect(new URL('/?status=google_connected', req.url));

  } catch (err) {
    console.error(`[${timestamp}] [OAuth Callback] Exception:`, err);
    return NextResponse.redirect(new URL('/connections?error=server_error', req.url));
  }
}
