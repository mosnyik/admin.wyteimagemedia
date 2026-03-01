import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const { recipients, subject, message } = await request.json()

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

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed.length,
      total: recipients.length,
    })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send emails" }, { status: 500 })
  }
}
