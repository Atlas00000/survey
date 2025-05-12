"use client"

import { useEffect, useState } from "react"
import { SurveySubmission } from "@/lib/models/survey"

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null)

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Survey Submissions</h2>

          {submissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <li
                    key={submission.referenceNumber}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedSubmission?.referenceNumber === submission.referenceNumber
                        ? 'bg-blue-50'
                        : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="font-medium">{submission.name}</div>
                    <div className="text-sm text-gray-600">{submission.email}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Ref: {submission.referenceNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(submission.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submission Details */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Submission Details</h2>

          {!selectedSubmission ? (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              Select a submission from the list to view details
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{selectedSubmission.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{selectedSubmission.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{selectedSubmission.phoneNumber || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Reference Number</div>
                  <div className="font-medium">{selectedSubmission.referenceNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Submitted On</div>
                  <div className="font-medium">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Section */}
              <h3 className="text-lg font-semibold mb-3 border-t pt-4">Uploaded Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Driver's License Front */}
                {selectedSubmission.driverLicenseFront && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-medium">
                      Driver's License (Front)
                    </div>
                    <div className="p-4">
                      {selectedSubmission.driverLicenseFront.startsWith('/uploads/') ? (
                        <div className="aspect-video bg-gray-50 flex items-center justify-center">
                          <img
                            src={selectedSubmission.driverLicenseFront}
                            alt="Driver's License Front"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-50 flex items-center justify-center">
                          <p className="text-gray-500 text-sm p-4 text-center">
                            {selectedSubmission.driverLicenseFront}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Driver's License Back */}
                {selectedSubmission.driverLicenseBack && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-medium">
                      Driver's License (Back)
                    </div>
                    <div className="p-4">
                      {selectedSubmission.driverLicenseBack.startsWith('/uploads/') ? (
                        <div className="aspect-video bg-gray-50 flex items-center justify-center">
                          <img
                            src={selectedSubmission.driverLicenseBack}
                            alt="Driver's License Back"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-50 flex items-center justify-center">
                          <p className="text-gray-500 text-sm p-4 text-center">
                            {selectedSubmission.driverLicenseBack}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
