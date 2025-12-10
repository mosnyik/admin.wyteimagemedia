import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin Dashboard - Pageant Management",
  description: "Manage contestants, screening, and communication for Global Humanitarian Queen Nigeria 2026",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return children
}
