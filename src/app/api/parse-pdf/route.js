import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const POST = async (request) => {
  try {
    // Extract raw binary data from the request
    const buffer = await request.arrayBuffer();
    const fileBuffer = Buffer.from(buffer); // Convert ArrayBuffer to Buffer for pdf-parse

    // Parse the PDF file
    const data = await pdf(fileBuffer);

    // Return extracted text as JSON response
    return NextResponse.json({ text: data.text }, { status: 200 });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse the PDF file." },
      { status: 500 }
    );
  }
};
