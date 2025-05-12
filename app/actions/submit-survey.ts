"use server"

import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import { generateReferenceNumber } from "@/lib/models/survey"

// Define a schema that accepts any input without validation
const fileSchema = z.any()

// Define the form schema with no validation
const formSchema = z.object({
  name: z.any(),
  email: z.any(),
  gender: z.any(),
  phoneNumber: z.any(),
  birthCity: z.any(),
  ssn: z.any(),
  motherFullName: z.any(),
  fatherFullName: z.any(),
  motherMaidenName: z.any(),
  pastDueAmount: z.any(),
  evicted: z.any(),
  appliedBefore: z.any(),
  socialSecurity: z.any(),
  idVerified: z.any(),
  driverLicenseFront: fileSchema,
  driverLicenseBack: fileSchema,
})

export type FormData = z.infer<typeof formSchema>

export async function submitSurvey(formData: FormData) {
  try {
    // Skip validation and use the data directly

    // Clean up file data for JSON serialization
    const cleanedData = { ...formData }
    if (cleanedData.driverLicenseFront) {
      cleanedData.driverLicenseFront = "File uploaded"
    }
    if (cleanedData.driverLicenseBack) {
      cleanedData.driverLicenseBack = "File uploaded"
    }

    // Connect directly to MongoDB
    const client = await clientPromise
    const db = client.db("survey")
    const surveysCollection = db.collection("submissions")

    // Generate a reference number for this submission
    const referenceNumber = generateReferenceNumber()

    // Prepare the submission data
    const submissionData = {
      ...cleanedData,
      referenceNumber,
      createdAt: new Date()
    }

    // Store the submission in MongoDB
    await surveysCollection.insertOne(submissionData)

    console.log(`Submission saved to database with reference number: ${referenceNumber}`)

    return {
      success: true,
      reference: referenceNumber
    }
  } catch (error) {
    console.error("Error submitting survey:", error)
    // No validation errors to check for anymore
    return { success: false, error: "Failed to submit application. Please try again later." }
  }
}
