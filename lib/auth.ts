import { cookies } from "next/headers"

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value

  if (!session) {
    return null
  }

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}
