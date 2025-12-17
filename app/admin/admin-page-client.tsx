// AdminPageComponent component definition
"use client";

import { useEffect, useState } from "react";
import ContestantList from "@/components/admin/contestant-list";
import EmailModal from "@/components/admin/email-modal";
import AdminHeader from "@/components/admin/admin-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client } from "@/sanity/lib/client";
import { formSubmissionQuery } from "@/lib/queries";
import Loading from "@/components/shared/Loading";
type Contestant = {
  id: number;
  surname: string;
  firstName: string;
  email: string;
  phone: string;
  country: string;
  profession: string;
  status: "pending" | "qualified" | "disqualified";
  screeningStatus: "pending" | "screened" | "rejected";
  appliedDate: string;
  photos: number;
};

// interface Contestant {
//   _id: string;
//   id: number;

//   surname?: string;
//   firstName?: string;
//   otherNames?: string;
//   dateOfBirth?: string;
//   age?: string;
//   phoneNumbers?: string;
//   whatsappPhone?: string;
//   email?: string;
//   countryOfResidence?: string;
//   cityOrTown?: string;
//   postCOdeOrStreet?: string;
//   profession?: string;

//   maritalStatus?: "single" | "married" | "widowed" | "divorced";

//   givenBirth?: "yes" | "no";
//   numberOfChildren?: string;
//   stillInSchool?: "yes" | "no";
//   institutionName?: string;
//   alreadyGraduated?: "yes" | "no";
//   discipline?: string;
//   workingClassLady?: "yes" | "no";
//   company?: string;
//   position?: string;
//   businessNature?: string;
//   image1?: number;
//   image2?: number;
//   // photos: number;
//   submittedAt?: string;
//   status: "pending" | "qualified" | "disqualified";
//   screeningStatus?: "pending" | "screened" | "rejected";
//   isDisqualified?: boolean;
//   disqualificationReason?: string;

//   screenedBy?: string;
//   screenedAt?: string;
//   votesReceived?: string;
//   totalAmountFromVotes?: string;
// }

// Mock data - replace with actual API calls
// const mockContestants: contestant[] = [
//   {
//     id: 1,
//     surname: "Adeyemi",
//     firstName: "Chioma",
//     email: "chioma.adeyemi@email.com",
//     phone: "+234 803 456 7890",
//     country: "Nigeria",
//     profession: "Model",
//     status: "pending",
//     screeningStatus: "pending",
//     appliedDate: "2024-01-15",
//     photos: 3,
//   },
//   {
//     id: 2,
//     surname: "Okafor",
//     firstName: "Blessing",
//     email: "blessing.okafor@email.com",
//     phone: "+234 802 345 6789",
//     country: "Nigeria",
//     profession: "Nurse",
//     status: "qualified",
//     screeningStatus: "screened",
//     appliedDate: "2024-01-10",
//     photos: 2,
//   },
//   {
//     id: 3,
//     surname: "Ejiofor",
//     firstName: "Amaka",
//     email: "amaka.ejiofor@email.com",
//     phone: "+234 801 234 5678",
//     country: "UK",
//     profession: "Accountant",
//     status: "pending",
//     screeningStatus: "pending",
//     appliedDate: "2024-01-18",
//     photos: 4,
//   },
//   {
//     id: 4,
//     surname: "Ibrahim",
//     firstName: "Zainab",
//     email: "zainab.ibrahim@email.com",
//     phone: "+234 807 890 1234",
//     country: "Nigeria",
//     profession: "Fashion Designer",
//     status: "disqualified",
//     screeningStatus: "rejected",
//     appliedDate: "2024-01-12",
//     photos: 2,
//   },
// ];

export function AdminPageComponent({ userEmail }: { userEmail: string }) {
  const [selectedContestants, setSelectedContestants] = useState<number[]>([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // track active filter tab

  // const [data, setData] = useState<Contestant[] | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);

  
  useEffect(() => {
    client.fetch(formSubmissionQuery).then((results) => {
      // const formatted = results.map((item: any, index: number) => ({
      //   id: index + 1,
      //   name: `${item.firstName} ${item.surname}`,
      //   title: item.profession ?? "Contestant",
      //   image: item.imageUrl,
      // }));
      const formatted: Contestant[] = results.map(
        (item: any, index: number) => {
          const photosCount = [item.image1, item.image2].filter(Boolean).length;

          const status: Contestant["status"] = item.isDisqualified
            ? "disqualified"
            : item.screeningStatus === "screened"
            ? "qualified"
            : "pending";

          return {
            id: index + 1,

            surname: item.surname ?? "",
            firstName: item.firstName ?? "",

            email: item.email ?? "",
            phone: item.phoneNumbers ?? "",

            country: item.countryOfResidence ?? "",
            profession: item.profession ?? "Contestant",

            status,
            screeningStatus: item.screeningStatus ?? "pending",

            appliedDate: item.submittedAt ?? "",
            photos: photosCount,
          };
        }
      );


      setContestants(formatted);
    });
  }, []);
  // const contestantList: Contestant[] = data || [];

  const updateContestantStatus = (
    id: number,
    status: "pending" | "qualified" | "disqualified",
    screeningStatus?: "pending" | "screened" | "rejected"
  ) => {
    setContestants(
      contestants.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              screeningStatus: screeningStatus || c.screeningStatus,
            }
          : c
      )
    );
  };

  const toggleContestantSelection = (id: number) => {
    setSelectedContestants((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const selectAll = (filterStatus: string | null) => {
    let filteredContestants = contestants;

    if (filterStatus === "pending") {
      filteredContestants = contestants.filter((c) => c.status === "pending");
    } else if (filterStatus === "qualified") {
      filteredContestants = contestants.filter((c) => c.status === "qualified");
    } else if (filterStatus === "disqualified") {
      filteredContestants = contestants.filter(
        (c) => c.status === "disqualified"
      );
    }

    const filteredIds = filteredContestants.map((c) => c.id);

    if (selectedContestants.length === filteredIds.length) {
      setSelectedContestants([]);
    } else {
      setSelectedContestants(filteredIds);
    }
  };


  console.log({ contestants });

  if (!contestants)
    return (
      <div className="flex justify-center items-center h-screen text-black">
        <Loading />
      </div>
    );

  const pendingCount = contestants.filter((c) => c.status === "pending").length;
  const qualifiedCount = contestants.filter(
    (c) => c.status === "qualified"
  ).length;
  const disqualifiedCount = contestants.filter(
    (c) => c.status === "disqualified"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader userEmail={userEmail} />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Contestant Management
          </h1>
          <p className="text-muted-foreground">
            Screen, qualify, and communicate with pageant contestants
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Total Contestants
            </div>
            <div className="text-3xl font-bold text-foreground">
              {contestants.length}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Pending Review
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Qualified</div>
            <div className="text-3xl font-bold text-teal-600">
              {qualifiedCount}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Disqualified
            </div>
            <div className="text-3xl font-bold text-red-600">
              {disqualifiedCount}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="all">All Contestants</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="qualified">Qualified</TabsTrigger>
            <TabsTrigger value="disqualified">Disqualified</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ContestantList
              contestants={contestants}
              selectedContestants={selectedContestants}
              onSelectContestant={toggleContestantSelection}
              onSelectAll={() => selectAll(null)}
              onUpdateStatus={updateContestantStatus}
              onOpenEmailModal={() => setEmailModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <ContestantList
              contestants={contestants.filter((c) => c.status === "pending")}
              selectedContestants={selectedContestants}
              onSelectContestant={toggleContestantSelection}
              onSelectAll={() => selectAll("pending")}
              onUpdateStatus={updateContestantStatus}
              onOpenEmailModal={() => setEmailModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="qualified" className="space-y-4">
            <ContestantList
              contestants={contestants.filter((c) => c.status === "qualified")}
              selectedContestants={selectedContestants}
              onSelectContestant={toggleContestantSelection}
              onSelectAll={() => selectAll("qualified")}
              onUpdateStatus={updateContestantStatus}
              onOpenEmailModal={() => setEmailModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="disqualified" className="space-y-4">
            <ContestantList
              contestants={contestants.filter(
                (c) => c.status === "disqualified"
              )}
              selectedContestants={selectedContestants}
              onSelectContestant={toggleContestantSelection}
              onSelectAll={() => selectAll("disqualified")}
              onUpdateStatus={updateContestantStatus}
              onOpenEmailModal={() => setEmailModalOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Email Modal */}
      <EmailModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        selectedCount={selectedContestants.length}
        contestants={contestants.filter((c) =>
          selectedContestants.includes(c.id)
        )}
      />
    </div>
  );
}
