import { cookies } from "next/headers"

// Mock user database - in production, this would be a real database
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
    const { email, password, fullName } = await request.json()

    // Validate input
    if (!email || !password || !fullName) {
      return Response.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user exists
    if (users.find((u) => u.email === email)) {
      return Response.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email,
      password, // In production, this would be hashed with bcrypt
      fullName,
    }

    users.push(newUser)

    const cookieStore = await cookies()
    cookieStore.set("admin_session", JSON.stringify({ userId: newUser.id, email: newUser.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
