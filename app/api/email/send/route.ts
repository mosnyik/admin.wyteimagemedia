import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { getSession } from "@/lib/auth"
import { checkAndIncrement } from "@/lib/paywall"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const paywall = await checkAndIncrement(session.email, "email")
    if (!paywall.allowed) {
      return NextResponse.json(
        { error: "paywall", message: "You have reached your free email limit. Upgrade to continue." },
        { status: 402 }
      )
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const { recipients, subject, message, replyTo } = await request.json()

    // Use provided replyTo or fall back to env default
    const defaultReplyTo = process.env.RESEND_REPLY_TO_EMAILS || process.env.NEXT_PUBLIC_DEFAULT_REPLY_TO
    const replyToEmails = replyTo || (defaultReplyTo ? defaultReplyTo.split(",").map((e: string) => e.trim()) : [])

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required" }, { status: 400 })
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 })
    }

    console.log("Sending emails to:", recipients.map((r: { email: string }) => r.email))

    // Send emails to each recipient individually
    const results = await Promise.allSettled(
      recipients.map(async (recipient: { email: string; firstName: string }) => {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Wyte Image Media <onboarding@resend.dev>",
          to: recipient.email,
          subject: subject,
          replyTo: replyToEmails.length > 0 ? replyToEmails : undefined,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <p>Dear ${recipient.firstName},</p>
              ${message.split("\n").map((line: string) => `<p>${line}</p>`).join("")}
            </div>
          `,
        })

        if (error) {
          console.error("Resend error for", recipient.email, ":", error)
          throw new Error(error.message)
        }

        console.log("Email sent to", recipient.email, "- ID:", data?.id)
        return { email: recipient.email, id: data?.id }
      })
    )

    const successful = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected")

    if (failed.length > 0) {
      console.error("Failed emails:", failed.map((f) => (f as PromiseRejectedResult).reason))
    }

    const paywallRemaining = Math.max(0, paywall.limit - paywall.count)

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed.length,
      total: recipients.length,
      paywallRemaining,
    })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send emails" }, { status: 500 })
  }
}
