import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { generateReferenceNumber, SurveySubmission } from "@/lib/models/survey"

export async function POST(request: Request) {
  try {
    // Parse the form data from the request
    const formData = await request.json()

    // Log the form data to the console for debugging
    console.log("Form data received:", formData)

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("survey")
    const surveysCollection = db.collection("submissions")

    // Generate a reference number for this submission
    const referenceNumber = generateReferenceNumber()

    // Prepare the submission data
    const submissionData: SurveySubmission = {
      ...formData,
      referenceNumber,
      createdAt: new Date()
    }

    // Store the submission in MongoDB
    await surveysCollection.insertOne(submissionData)

    console.log(`Submission saved to database with reference number: ${referenceNumber}`)

    // Return the reference number with the response
    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      referenceNumber
    }, { status: 200 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
