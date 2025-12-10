"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, AlertCircle, Save, Trash2 } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  message: string
}

interface EmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  contestants: Array<{
    id: number
    firstName: string
    email: string
  }>
}

export default function EmailModal({ open, onOpenChange, selectedCount, contestants }: EmailModalProps) {
  const [activeTab, setActiveTab] = useState("write")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Qualification Approved",
      subject: "Congratulations! You've been qualified for the pageant",
      message:
        "Dear Contestant,\n\nWe are pleased to inform you that you have been qualified for the upcoming pageant. Your submission was exceptional, and we look forward to seeing you compete.\n\nPlease review the competition details and confirm your participation.\n\nBest regards,\nPageant Admin Team",
    },
    {
      id: "2",
      name: "Submission Received",
      subject: "We received your pageant registration",
      message:
        "Dear Contestant,\n\nThank you for submitting your registration for our pageant. We have received all your information and will review your profile shortly.\n\nYou will be notified of our decision within 5-7 business days.\n\nBest regards,\nPageant Admin Team",
    },
  ])

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill in subject and message")
      return
    }

    setIsSending(true)
    try {
      // Simulate API call - replace with actual email API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert(`Email sent to ${selectedCount} contestant(s)`)
      setSubject("")
      setMessage("")
      setTemplateName("")
      onOpenChange(false)
    } finally {
      setIsSending(false)
    }
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !subject.trim() || !message.trim()) {
      alert("Please fill in template name, subject, and message")
      return
    }

    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateName,
      subject,
      message,
    }

    setTemplates([...templates, newTemplate])
    setTemplateName("")
    alert("Template saved successfully!")
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSubject(template.subject)
      setMessage(template.message)
      setSelectedTemplate(templateId)
      setActiveTab("write")
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-600" />
            Send Email
          </DialogTitle>
          <DialogDescription>
            Send email to {selectedCount} contestant{selectedCount !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="write">Write Email</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="save">Save Template</TabsTrigger>
          </TabsList>

          {/* Write Email Tab */}
          <TabsContent value="write" className="space-y-4">
            {/* Recipients Preview */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-900 mb-2">Recipients:</p>
              <div className="flex flex-wrap gap-2">
                {contestants.map((contestant) => (
                  <span
                    key={contestant.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"
                  >
                    {contestant.firstName}
                  </span>
                ))}
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-foreground font-medium">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-2 border-border"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-foreground font-medium">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Write your message here..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 border-border"
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Emails will be sent individually to each recipient. They will not see other recipients.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No templates saved yet. Create and save your first template!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-border rounded-lg p-4 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-foreground">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadTemplate(template.id)}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.message}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Save Template Tab */}
          <TabsContent value="save" className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Fill in the form below to save the current email as a template for future use.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name" className="text-foreground font-medium">
                  Template Name *
                </Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Qualification Approved"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="mt-2 border-border"
                />
              </div>

              <div>
                <Label htmlFor="template-subject" className="text-foreground font-medium">
                  Subject *
                </Label>
                <Input
                  id="template-subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-2 border-border"
                />
              </div>

              <div>
                <Label htmlFor="template-message" className="text-foreground font-medium">
                  Message *
                </Label>
                <Textarea
                  id="template-message"
                  placeholder="Write your message here..."
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 border-border"
                />
              </div>

              <Button onClick={handleSaveTemplate} className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2">
                <Save className="w-4 h-4" />
                Save as Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !subject.trim() || !message.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
