"use client"

import { useEffect, useState } from "react"
import { SurveySubmission } from "@/lib/models/survey"

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch("/api/admin/submissions")
        if (!response.ok) {
          throw new Error("Failed to fetch submissions")
        }
        const data = await response.json()
        setSubmissions(data.submissions)
      } catch (err) {
        setError("Error loading submissions. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p>Loading submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Survey Submissions</h2>
      
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Reference #</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.referenceNumber} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{submission.referenceNumber}</td>
                  <td className="py-2 px-4 border-b">{submission.name}</td>
                  <td className="py-2 px-4 border-b">{submission.email}</td>
                  <td className="py-2 px-4 border-b">{submission.phoneNumber}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
