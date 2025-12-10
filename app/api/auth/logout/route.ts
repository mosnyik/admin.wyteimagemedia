import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin_session")

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
