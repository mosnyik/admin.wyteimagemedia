import { cookies } from "next/headers"

// Mock Google OAuth response - in production, this would use real Google OAuth
const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123",
    fullName: "Admin User",
  },
]

export async function POST(request: Request) {
  try {
    // In production, you would:
    // 1. Exchange authorization code for ID token with Google
    // 2. Verify the ID token
    // 3. Create/find user in database
    // 4. Create session

    // For demo purposes, we'll create a mock Google user
    const googleUser = {
      id: "google_" + Date.now(),
      email: "user@gmail.com",
      fullName: "Google User",
      provider: "google",
    }

    // Check if user exists
    let existingUser = users.find((u) => u.email === googleUser.email)

    if (!existingUser) {
      existingUser = {
        id: googleUser.id,
        email: googleUser.email,
        password: "", // Google users don't have passwords
        fullName: googleUser.fullName,
      }
      users.push(existingUser)
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session", JSON.stringify({ userId: existingUser.id, email: existingUser.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({
      success: true,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.fullName,
      },
    })
  } catch (error) {
    return Response.json({ error: "Google authentication failed" }, { status: 500 })
  }
}
