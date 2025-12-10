import { cookies } from "next/headers"

// Mock user database - in production, this would be a real database
const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123", // In production, this would be hashed
    fullName: "Admin User",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session", JSON.stringify({ userId: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
