import { SurveySubmission } from "@/lib/models/survey";

/**
 * Convert an array of survey submissions to CSV format
 */
export function convertToCSV(submissions: SurveySubmission[]): string {
  if (!submissions || submissions.length === 0) {
    return "";
  }

  // Define the headers for the CSV
  const headers = [
    "Reference Number",
    "Name",
    "Email",
    "Phone Number",
    "SSN",
    "Gender",
    "Birth City",
    "Mother's Full Name",
    "Father's Full Name",
    "Mother's Maiden Name",
    "Past Due Amount",
    "Driver's License Front",
    "Driver's License Back",
    "Created At"
  ];

  // Create the CSV header row
  let csv = headers.join(",") + "\n";

  // Add each submission as a row
  submissions.forEach(submission => {
    const row = [
      escapeCsvValue(submission.referenceNumber || ""),
      escapeCsvValue(submission.name || ""),
      escapeCsvValue(submission.email || ""),
      escapeCsvValue(submission.phoneNumber || ""),
      escapeCsvValue(submission.ssn || ""),
      escapeCsvValue(submission.gender || ""),
      escapeCsvValue(submission.birthCity || ""),
      escapeCsvValue(submission.motherFullName || ""),
      escapeCsvValue(submission.fatherFullName || ""),
      escapeCsvValue(submission.motherMaidenName || ""),
      escapeCsvValue(submission.pastDueAmount || ""),
      escapeCsvValue(submission.driverLicenseFront || ""),
      escapeCsvValue(submission.driverLicenseBack || ""),
      escapeCsvValue(new Date(submission.createdAt).toISOString() || "")
    ];
    csv += row.join(",") + "\n";
  });

  return csv;
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCsvValue(value: string): string {
  // If the value contains a comma, quote, or newline, wrap it in quotes
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    // Double up any quotes to escape them
    const escapedValue = value.replace(/"/g, "\"\"");
    return `"${escapedValue}"`;
  }
  return value;
}

/**
 * Download CSV data as a file
 */
export function downloadCsv(csvContent: string, filename: string = "survey-submissions.csv"): void {
  // Create a blob with the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link
  const link = document.createElement("a");
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set the link's properties
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  // Add the link to the DOM
  document.body.appendChild(link);
  
  // Click the link to trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
