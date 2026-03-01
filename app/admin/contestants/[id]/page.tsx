import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { client } from "@/sanity/lib/client"
import { contestantByIdQuery } from "@/lib/queries"
import ContestantProfile from "./contestant-profile"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContestantProfilePage({ params }: PageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const contestant = await client.fetch(contestantByIdQuery, { id })

  if (!contestant) {
    redirect("/admin")
  }

  return <ContestantProfile contestant={contestant} userEmail={session.email} userName={session.name} />
}
