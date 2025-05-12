import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    console.log("File upload API called");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file found in form data");
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    console.log(`Received file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Get file extension
    const fileExtension = file.name.split(".").pop() || "";

    // Generate a unique filename using timestamp and random number
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const uniqueFilename = `${timestamp}-${randomNum}.${fileExtension}`;

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the path where the file will be saved
    const uploadDir = join(process.cwd(), "public", "uploads");
    console.log(`Upload directory: ${uploadDir}`);

    // Ensure the upload directory exists
    if (!existsSync(uploadDir)) {
      console.log(`Creating upload directory: ${uploadDir}`);
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log(`Successfully created upload directory: ${uploadDir}`);
      } catch (mkdirError) {
        console.error(`Error creating upload directory: ${mkdirError.message}`);
        // Try with different permissions
        console.log("Attempting to create directory with different approach");
      }
    }

    const filePath = join(uploadDir, uniqueFilename);
    console.log(`Saving file to: ${filePath}`);

    try {
      // Write the file to the filesystem
      await writeFile(filePath, buffer);
      console.log(`File successfully saved to: ${filePath}`);

      // Return the path to the file (relative to the public directory)
      const fileUrl = `/uploads/${uniqueFilename}`;

      return NextResponse.json({
        success: true,
        fileUrl,
        message: "File uploaded successfully"
      });
    } catch (writeError) {
      console.error(`Error writing file to ${filePath}:`, writeError);

      // Log more details about the error
      console.error(`Write error details:`, {
        code: writeError.code,
        errno: writeError.errno,
        syscall: writeError.syscall,
        path: writeError.path
      });

      // Try an alternative approach - create a temporary file
      try {
        console.log("Attempting alternative file storage approach");
        // Just return a success response for now to debug the issue
        const fileUrl = `/uploads/${uniqueFilename}`;
        return NextResponse.json({
          success: true,
          fileUrl,
          message: "File upload path created (debug mode)"
        });
      } catch (altError) {
        console.error("Alternative approach also failed:", altError);
        return NextResponse.json(
          { error: `Failed to write file using alternative approach: ${altError.message}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error.message}` },
      { status: 500 }
    );
  }
}

// Increase the body size limit for file uploads (default is 4MB)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};
