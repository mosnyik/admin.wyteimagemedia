"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  userEmail?: string
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
      setLoading(false)
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Pageant Admin</h2>
          <p className="text-xs text-muted-foreground">Global Humanitarian Queen Nigeria 2026</p>
        </div>
        <div className="flex items-center gap-4">
          {userEmail && <span className="text-sm text-muted-foreground">{userEmail}</span>}
          <Button
            onClick={handleLogout}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  )
}
