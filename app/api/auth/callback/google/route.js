import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/connections?error=no_code', req.url));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/google`;

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
      console.error('Google OAuth Error:', tokenData);
      return NextResponse.redirect(new URL(`/connections?error=${tokenData.error}`, req.url));
    }

    // Redirect to Dashboard on successful authentication
    return NextResponse.redirect(new URL('/?status=google_connected', req.url));
  } catch (err) {
    console.error('OAuth Callback exception:', err);
    return NextResponse.redirect(new URL('/connections?error=server_error', req.url));
  }
}
