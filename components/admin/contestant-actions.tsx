"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Check, X, Eye, CheckCircle, XCircle } from "lucide-react"

interface ContestantActionsProps {
  contestant: {
    id: number
    firstName: string
    surname: string
    photos: number
  }
  onUpdateStatus: (
    id: number,
    status: "pending" | "qualified" | "disqualified",
    screeningStatus?: "pending" | "screened" | "rejected",
  ) => void
  expanded: boolean
  onToggleExpanded: () => void
}

export default function ContestantActions({
  contestant,
  onUpdateStatus,
  expanded,
  onToggleExpanded,
}: ContestantActionsProps) {
  return (
    <DropdownMenu open={expanded} onOpenChange={onToggleExpanded}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Screening Status</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(contestant.id, "pending", "screened")}
          className="gap-2 cursor-pointer"
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Mark as Screened</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(contestant.id, "disqualified", "rejected")}
          className="gap-2 cursor-pointer"
        >
          <XCircle className="h-4 w-4 text-red-600" />
          <span>Mark as Rejected</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(contestant.id, "pending", "pending")}
          className="gap-2 cursor-pointer"
        >
          <span>Reset to Pending</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Qualification</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onUpdateStatus(contestant.id, "qualified")} className="gap-2 cursor-pointer">
          <Check className="h-4 w-4 text-teal-600" />
          <span>Qualify</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(contestant.id, "disqualified")}
          className="gap-2 cursor-pointer"
        >
          <X className="h-4 w-4 text-red-600" />
          <span>Disqualify</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Eye className="h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
