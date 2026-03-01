import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"

// List of allowed admin emails
const ALLOWED_EMAILS = process.env.ALLOWED_ADMIN_EMAILS?.split(",") || []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_denied", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens)
      return NextResponse.redirect(new URL("/login?error=token_exchange", request.url))
    }

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = await userInfoResponse.json()

    if (!userInfoResponse.ok) {
      console.error("User info fetch failed:", userInfo)
      return NextResponse.redirect(new URL("/login?error=user_info", request.url))
    }

    // Check if email is allowed (if ALLOWED_EMAILS is configured)
    if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(userInfo.email)) {
      return NextResponse.redirect(new URL("/login?error=not_authorized", request.url))
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set(
      "admin_session",
      JSON.stringify({
        userId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    )

    return NextResponse.redirect(new URL("/admin", request.url))
  } catch (error) {
    console.error("OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
