"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ContestantActions from "./contestant-actions"
import { Mail, Check, X } from "lucide-react"

interface Contestant {
  id: number
  surname: string
  firstName: string
  email: string
  phone: string
  country: string
  profession: string
  status: "pending" | "qualified" | "disqualified"
  screeningStatus: "pending" | "screened" | "rejected"
  appliedDate: string
  photos: number
}

interface ContestantListProps {
  contestants: Contestant[]
  selectedContestants: number[]
  onSelectContestant: (id: number) => void
  onSelectAll: () => void
  onUpdateStatus: (
    id: number,
    status: "pending" | "qualified" | "disqualified",
    screeningStatus?: "pending" | "screened" | "rejected",
  ) => void
  onOpenEmailModal: () => void
}

export default function ContestantList({
  contestants,
  selectedContestants,
  onSelectContestant,
  onSelectAll,
  onUpdateStatus,
  onOpenEmailModal,
}: ContestantListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified":
        return "bg-teal-100 text-teal-700 border-teal-300"
      case "disqualified":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
    }
  }

  const getScreeningStatusColor = (status: string) => {
    switch (status) {
      case "screened":
        return "bg-green-100 text-green-700 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-border px-4 py-4 bg-background/50 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox
                  checked={selectedContestants.length === contestants.length && contestants.length > 0}
                  onCheckedChange={onSelectAll}
                  className="w-5 h-5"
                />
              </TooltipTrigger>
              <TooltipContent>
                {selectedContestants.length === contestants.length && contestants.length > 0
                  ? "Deselect all contestants"
                  : "Select all contestants"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-muted-foreground">{selectedContestants.length} selected</span>
        </div>
        {selectedContestants.length > 0 && (
          <Button onClick={onOpenEmailModal} className="bg-teal-600 hover:bg-teal-700 text-white gap-2" size="sm">
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-4 py-3 text-left">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Checkbox className="w-5 h-5" onChange={onSelectAll} />
                    </TooltipTrigger>
                    <TooltipContent>
                      {selectedContestants.length === contestants.length && contestants.length > 0
                        ? "Deselect all"
                        : "Select all"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Country</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Qualification</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Screening</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Applied</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contestants.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No contestants found
                </td>
              </tr>
            ) : (
              contestants.map((contestant) => (
                <tr key={contestant.id} className="border-b border-border hover:bg-background/50 transition-colors">
                  <td className="px-4 py-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Checkbox
                            checked={selectedContestants.includes(contestant.id)}
                            onCheckedChange={() => onSelectContestant(contestant.id)}
                            className="w-5 h-5"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {selectedContestants.includes(contestant.id) ? "Deselect contestant" : "Select contestant"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {contestant.firstName} {contestant.surname}
                      </p>
                      <p className="text-xs text-muted-foreground">{contestant.profession}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{contestant.email}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{contestant.country}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contestant.status)}`}
                    >
                      {contestant.status === "qualified" && <Check className="w-3 h-3 mr-1" />}
                      {contestant.status === "disqualified" && <X className="w-3 h-3 mr-1" />}
                      {contestant.status.charAt(0).toUpperCase() + contestant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getScreeningStatusColor(contestant.screeningStatus)}`}
                    >
                      {contestant.screeningStatus === "screened" && <Check className="w-3 h-3 mr-1" />}
                      {contestant.screeningStatus === "rejected" && <X className="w-3 h-3 mr-1" />}
                      {contestant.screeningStatus.charAt(0).toUpperCase() + contestant.screeningStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{contestant.appliedDate}</td>
                  <td className="px-4 py-3">
                    <ContestantActions
                      contestant={contestant}
                      onUpdateStatus={onUpdateStatus}
                      expanded={expandedId === contestant.id}
                      onToggleExpanded={() => setExpandedId(expandedId === contestant.id ? null : contestant.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
