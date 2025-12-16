
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminPageComponent } from "./admin-page-client"



export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return <AdminPageComponent userEmail={session.email} />
}
