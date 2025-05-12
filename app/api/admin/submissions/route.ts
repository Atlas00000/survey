import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("survey")
    
    // Get all submissions, sorted by creation date (newest first)
    const submissions = await db
      .collection("submissions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    // Return the submissions
    return NextResponse.json({ 
      success: true, 
      submissions 
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch submissions" 
    }, { status: 500 })
  }
}
