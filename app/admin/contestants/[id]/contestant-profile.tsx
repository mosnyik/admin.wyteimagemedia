"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PaywallModal from "@/components/admin/paywall-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Building,
  Heart,
  Baby,
  Check,
  X,
  User,
  Clock,
  Vote,
  DollarSign,
} from "lucide-react"

interface Contestant {
  _id: string
  surname?: string
  firstName?: string
  otherNames?: string
  dateOfBirth?: string
  age?: string
  phoneNumbers?: string
  whatsappPhone?: string
  email?: string
  countryOfResidence?: string
  cityOrTown?: string
  postCOdeOrStreet?: string
  profession?: string
  maritalStatus?: string
  givenBirth?: string
  numberOfChildren?: string
  stillInSchool?: string
  institutionName?: string
  alreadyGraduated?: string
  discipline?: string
  workingClassLady?: string
  company?: string
  position?: string
  businessNature?: string
  image1Url?: string
  image2Url?: string
  submittedAt?: string
  screeningStatus?: string
  isDisqualified?: boolean
  disqualificationReason?: string
  screenedBy?: string
  screenedAt?: string
  votesReceived?: string
  totalAmountFromVotes?: string
}

interface ContestantProfileProps {
  contestant: Contestant
  userEmail: string
  userName?: string
}

export default function ContestantProfile({ contestant, userEmail, userName }: ContestantProfileProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [paywallOpen, setPaywallOpen] = useState(false)

  const getStatusBadge = () => {
    if (contestant.isDisqualified) {
      return <Badge variant="destructive">Disqualified</Badge>
    }
    switch (contestant.screeningStatus) {
      case "screened":
        return <Badge className="bg-green-600">Qualified</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const updateStatus = async (
    status: "pending" | "qualified" | "disqualified",
    screeningStatus: "pending" | "screened" | "rejected"
  ) => {
    // Reset to pending is not a paywalled action
    const isReset = status === "pending" && screeningStatus === "pending"

    if (!isReset) {
      try {
        const paywallRes = await fetch("/api/paywall/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "qualification" }),
        })
        if (paywallRes.status === 402) {
          setPaywallOpen(true)
          return
        }
      } catch {
        // allow on network error
      }
    }

    setIsUpdating(true)
    try {
      const response = await fetch("/api/contestants/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: contestant._id,
          screeningStatus,
          isDisqualified: status === "disqualified",
          screenedBy: userName || userEmail,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update contestant")
      }

      toast.success(`Contestant ${status === "qualified" ? "qualified" : status === "disqualified" ? "disqualified" : "updated"} successfully`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to update contestant status")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "N/A"}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold">Contestant Profile</h1>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contestant.image1Url ? (
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={contestant.image1Url}
                      alt={`${contestant.firstName} - Photo 1`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {contestant.image2Url && (
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={contestant.image2Url}
                      alt={`${contestant.firstName} - Photo 2`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => updateStatus("qualified", "screened")}
                  disabled={isUpdating || contestant.screeningStatus === "screened"}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Check className="h-4 w-4" />
                  Qualify Contestant
                </Button>
                <Button
                  onClick={() => updateStatus("disqualified", "rejected")}
                  disabled={isUpdating || contestant.isDisqualified}
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Disqualify Contestant
                </Button>
                <Button
                  onClick={() => updateStatus("pending", "pending")}
                  disabled={isUpdating || contestant.screeningStatus === "pending"}
                  variant="outline"
                  className="w-full"
                >
                  Reset to Pending
                </Button>
              </CardContent>
            </Card>

            {/* Screening Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Screening Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow icon={User} label="Screened By" value={contestant.screenedBy} />
                <InfoRow icon={Clock} label="Screened At" value={formatDateTime(contestant.screenedAt)} />
                {contestant.isDisqualified && contestant.disqualificationReason && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Disqualification Reason</p>
                    <p className="font-medium text-red-600">{contestant.disqualificationReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voting Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow icon={Vote} label="Votes Received" value={contestant.votesReceived || "0"} />
                <InfoRow icon={DollarSign} label="Total Amount from Votes" value={contestant.totalAmountFromVotes || "0"} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - All Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow icon={User} label="First Name" value={contestant.firstName} />
                  <InfoRow icon={User} label="Surname" value={contestant.surname} />
                  <InfoRow icon={User} label="Other Names" value={contestant.otherNames} />
                  <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(contestant.dateOfBirth)} />
                  <InfoRow icon={Calendar} label="Age" value={contestant.age} />
                  <InfoRow icon={Heart} label="Marital Status" value={contestant.maritalStatus} />
                  <InfoRow icon={Baby} label="Given Birth?" value={contestant.givenBirth} />
                  <InfoRow icon={Baby} label="Number of Children" value={contestant.numberOfChildren} />
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow icon={Mail} label="Email" value={contestant.email} />
                  <InfoRow icon={Phone} label="Phone Numbers" value={contestant.phoneNumbers} />
                  <InfoRow icon={Phone} label="WhatsApp Number" value={contestant.whatsappPhone} />
                  <InfoRow icon={MapPin} label="Country of Residence" value={contestant.countryOfResidence} />
                  <InfoRow icon={MapPin} label="City / Town" value={contestant.cityOrTown} />
                  <InfoRow icon={MapPin} label="Post Code / Street" value={contestant.postCOdeOrStreet} />
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow icon={GraduationCap} label="Still in School?" value={contestant.stillInSchool} />
                  <InfoRow icon={Building} label="Institution Name" value={contestant.institutionName} />
                  <InfoRow icon={GraduationCap} label="Already Graduated?" value={contestant.alreadyGraduated} />
                  <InfoRow icon={GraduationCap} label="Discipline" value={contestant.discipline} />
                </div>
              </CardContent>
            </Card>

            {/* Professional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow icon={Briefcase} label="Profession" value={contestant.profession} />
                  <InfoRow icon={Briefcase} label="Working Class Lady?" value={contestant.workingClassLady} />
                  <InfoRow icon={Building} label="Company" value={contestant.company} />
                  <InfoRow icon={Briefcase} label="Position" value={contestant.position} />
                  <InfoRow icon={Building} label="Nature of Business" value={contestant.businessNature} />
                </div>
              </CardContent>
            </Card>

            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow icon={Clock} label="Submitted At" value={formatDateTime(contestant.submittedAt)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
