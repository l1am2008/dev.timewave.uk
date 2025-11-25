"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import StaffModal from "@/components/staff-modal"
import useSWR from "swr"

interface StaffMember {
  id: number
  name: string
  role: string
  department: string
  bio: string
  email: string
  photo_url?: string
}

const departments = [
  "Governance & Strategic Leadership",
  "Volunteer & People Management",
  "Data Protection & Compliance",
  "News & Journalism",
  "On-Air Programming",
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Staff() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [expandedDept, setExpandedDept] = useState<string | null>(null)

  const { data: allStaff = [], isLoading } = useSWR("/api/staff", fetcher)

  const staffByDepartment = departments.reduce(
    (acc, dept) => {
      acc[dept] = (allStaff as StaffMember[]).filter((staff) => staff.department === dept)
      return acc
    },
    {} as Record<string, StaffMember[]>,
  )

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-2">Our Team</h1>
      <p className="text-muted-foreground mb-8">Meet the people behind Timewave Radio</p>

      {isLoading ? (
        <div className="text-muted-foreground">Loading staff...</div>
      ) : (
        <div className="space-y-4">
          {departments.map((department) => (
            <div key={department} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === department ? null : department)}
                className="w-full p-6 text-left hover:bg-muted transition-colors flex items-center justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold">{department}</h2>
                  <p className="text-muted-foreground text-sm">{staffByDepartment[department].length} member(s)</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${expandedDept === department ? "rotate-180" : ""}`}
                />
              </button>

              {expandedDept === department && (
                <div className="border-t border-border p-4 grid gap-3">
                  {staffByDepartment[department].map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedStaff(member)}
                      className="text-left p-4 bg-background rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-accent text-sm">{member.role}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedStaff && <StaffModal member={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </main>
  )
}
