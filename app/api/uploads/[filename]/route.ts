import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile, stat } from "fs/promises";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Security check - prevent path traversal attacks
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "public", "uploads");

    // Check if upload directory exists
    if (!existsSync(uploadDir)) {
      console.error(`Upload directory does not exist: ${uploadDir}`);
      return NextResponse.json(
        { error: "Upload directory not found" },
        { status: 404 }
      );
    }

    const filePath = join(uploadDir, filename);
    console.log(`Attempting to serve file: ${filePath}`);

    // Check if file exists
    try {
      await stat(filePath);
    } catch (error) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    let contentType = "application/octet-stream"; // Default content type

    if (extension === "jpg" || extension === "jpeg") {
      contentType = "image/jpeg";
    } else if (extension === "png") {
      contentType = "image/png";
    } else if (extension === "pdf") {
      contentType = "application/pdf";
    }

    console.log(`Serving file ${filename} with content type ${contentType}`);

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
