"use client"

import { useEffect, useState } from "react"
import { SurveySubmission } from "@/lib/models/survey"
import { CopyButton } from "@/components/ui/copy-button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Download, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageViewer } from "@/components/ui/image-viewer"
import { convertToCSV, downloadCsv } from "@/lib/utils/csv-export"

type SortField = "name" | "email" | "createdAt" | "referenceNumber"
type SortDirection = "asc" | "desc"

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<SurveySubmission[]>([])
  const [displayedSubmissions, setDisplayedSubmissions] = useState<SurveySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

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
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase()
      const filtered = submissions.filter(submission =>
        submission.name?.toLowerCase().includes(lowerCaseSearch) ||
        submission.email?.toLowerCase().includes(lowerCaseSearch) ||
        submission.referenceNumber?.toLowerCase().includes(lowerCaseSearch) ||
        (submission.phoneNumber && submission.phoneNumber.toLowerCase().includes(lowerCaseSearch))
      )
      setFilteredSubmissions(filtered)
    }

    // Reset to first page when search changes
    setCurrentPage(1)
  }, [searchTerm, submissions])

  // Sort and paginate submissions
  useEffect(() => {
    // Sort the filtered submissions
    const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
      // Handle null or undefined values
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      // For dates, convert to timestamps
      if (sortField === "createdAt") {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      // For strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    // Calculate total pages
    const calculatedTotalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
    setTotalPages(calculatedTotalPages || 1); // Ensure at least 1 page

    // Adjust current page if it's out of bounds
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(calculatedTotalPages);
    }

    // Get current page items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedSubmissions(sortedSubmissions.slice(startIndex, endIndex));

  }, [filteredSubmissions, currentPage, itemsPerPage, sortField, sortDirection])

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  }

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

  // Render sort icon based on current sort state
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ?
      <ArrowUp className="h-3 w-3 ml-1" /> :
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Handle CSV export
  const handleExportCsv = () => {
    const csvContent = convertToCSV(filteredSubmissions);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadCsv(csvContent, `survey-submissions-${timestamp}.csv`);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button
          onClick={handleExportCsv}
          className="flex items-center"
          disabled={filteredSubmissions.length === 0}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

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

          {/* Sorting Options */}
          <div className="bg-white rounded-lg shadow mb-4 p-3">
            <div className="text-sm font-medium mb-2">Sort by:</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortField === "createdAt" ? "default" : "outline"}
                size="sm"
                className="flex items-center"
                onClick={() => handleSort("createdAt")}
              >
                Date {renderSortIcon("createdAt")}
              </Button>
              <Button
                variant={sortField === "name" ? "default" : "outline"}
                size="sm"
                className="flex items-center"
                onClick={() => handleSort("name")}
              >
                Name {renderSortIcon("name")}
              </Button>
              <Button
                variant={sortField === "email" ? "default" : "outline"}
                size="sm"
                className="flex items-center"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIcon("email")}
              </Button>
              <Button
                variant={sortField === "referenceNumber" ? "default" : "outline"}
                size="sm"
                className="flex items-center"
                onClick={() => handleSort("referenceNumber")}
              >
                Reference {renderSortIcon("referenceNumber")}
              </Button>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              No submissions found matching your search.
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                  {displayedSubmissions.map((submission) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 bg-white p-2 rounded-lg shadow">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>

                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
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
                    <div className="bg-gray-100 px-4 py-2 font-medium">
                      <span>Driver's License (Front)</span>
                    </div>
                    <div className="p-4">
                      {selectedSubmission.driverLicenseFront.startsWith('/uploads/') ? (
                        <ImageViewer
                          src={selectedSubmission.driverLicenseFront}
                          alt="Driver's License Front"
                        />
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
                      <span>Driver's License (Back)</span>
                    </div>
                    <div className="p-4">
                      {selectedSubmission.driverLicenseBack.startsWith('/uploads/') ? (
                        <ImageViewer
                          src={selectedSubmission.driverLicenseBack}
                          alt="Driver's License Back"
                        />
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
