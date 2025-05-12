"use client"

import { useEffect, useState } from "react"
import { SurveySubmission } from "@/lib/models/survey"
import { CopyButton } from "@/components/ui/copy-button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<SurveySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch("/api/admin/submissions")
        if (!response.ok) {
          throw new Error("Failed to fetch submissions")
        }
        const data = await response.json()
        setSubmissions(data.submissions)
        setFilteredSubmissions(data.submissions)
      } catch (err) {
        setError("Error loading submissions. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  // Filter submissions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions)
      return
    }

    const lowerCaseSearch = searchTerm.toLowerCase()
    const filtered = submissions.filter(submission =>
      submission.name.toLowerCase().includes(lowerCaseSearch) ||
      submission.email.toLowerCase().includes(lowerCaseSearch) ||
      submission.referenceNumber.toLowerCase().includes(lowerCaseSearch) ||
      (submission.phoneNumber && submission.phoneNumber.toLowerCase().includes(lowerCaseSearch))
    )

    setFilteredSubmissions(filtered)
  }, [searchTerm, submissions])

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Survey Submissions</h2>
            <div className="text-sm text-gray-500">
              {filteredSubmissions.length} of {submissions.length}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, email, or reference..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              No submissions found matching your search.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredSubmissions.map((submission) => (
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
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <span>Ref: {submission.referenceNumber}</span>
                      <CopyButton
                        value={submission.referenceNumber}
                        className="ml-1 h-5 w-5 p-0"
                        variant="ghost"
                      />
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{selectedSubmission.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                    <span>{selectedSubmission.referenceNumber}</span>
                    <CopyButton
                      value={selectedSubmission.referenceNumber}
                      className="ml-1 h-5 w-5 p-0"
                      variant="ghost"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium flex items-center">
                    {selectedSubmission.email}
                    <CopyButton
                      value={selectedSubmission.email}
                      className="ml-1 h-5 w-5 p-0"
                      variant="ghost"
                    />
                  </div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium flex items-center">
                    {selectedSubmission.phoneNumber || 'N/A'}
                    {selectedSubmission.phoneNumber && (
                      <CopyButton
                        value={selectedSubmission.phoneNumber}
                        className="ml-1 h-5 w-5 p-0"
                        variant="ghost"
                      />
                    )}
                  </div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">SSN</div>
                  <div className="font-medium flex items-center">
                    {selectedSubmission.ssn || 'N/A'}
                    {selectedSubmission.ssn && (
                      <CopyButton
                        value={selectedSubmission.ssn}
                        className="ml-1 h-5 w-5 p-0"
                        variant="ghost"
                      />
                    )}
                  </div>
                </div>
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Submitted On</div>
                  <div className="font-medium">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3 border-t pt-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded p-3">
                    <div className="text-sm text-gray-500">Gender</div>
                    <div className="font-medium">{selectedSubmission.gender || 'N/A'}</div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-sm text-gray-500">Birth City</div>
                    <div className="font-medium">{selectedSubmission.birthCity || 'N/A'}</div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-sm text-gray-500">Mother's Full Name</div>
                    <div className="font-medium">{selectedSubmission.motherFullName || 'N/A'}</div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-sm text-gray-500">Father's Full Name</div>
                    <div className="font-medium">{selectedSubmission.fatherFullName || 'N/A'}</div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-sm text-gray-500">Mother's Maiden Name</div>
                    <div className="font-medium">{selectedSubmission.motherMaidenName || 'N/A'}</div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-sm text-gray-500">Past Due Amount</div>
                    <div className="font-medium">{selectedSubmission.pastDueAmount || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents Section */}
              <h3 className="text-md font-semibold mb-3 border-t pt-4">Uploaded Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Driver's License Front */}
                {selectedSubmission.driverLicenseFront && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-medium flex justify-between items-center">
                      <span>Driver's License (Front)</span>
                      {selectedSubmission.driverLicenseFront.startsWith('/uploads/') && (
                        <a
                          href={selectedSubmission.driverLicenseFront}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Full Size
                        </a>
                      )}
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
                    <div className="bg-gray-100 px-4 py-2 font-medium flex justify-between items-center">
                      <span>Driver's License (Back)</span>
                      {selectedSubmission.driverLicenseBack.startsWith('/uploads/') && (
                        <a
                          href={selectedSubmission.driverLicenseBack}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Full Size
                        </a>
                      )}
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
