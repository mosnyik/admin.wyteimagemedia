"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface PaywallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mx-auto mb-4">
            <Lock className="w-7 h-7 text-yellow-600" />
          </div>
          <DialogTitle className="text-center text-xl">Access Restricted</DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="text-sm text-muted-foreground">
              You have outstanding payment, pay up to continue.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => onOpenChange(false)}
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
