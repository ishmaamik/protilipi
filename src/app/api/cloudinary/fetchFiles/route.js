import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[DEBUG] Fetching PDFs from Cloudinary...");

    let allFiles = [];
    let nextCursor = null;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    do {
      // Fetch all raw files (PDFs) from Cloudinary
      let url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw/upload?context=true&max_results=100`;

      if (nextCursor) {
        url += `&next_cursor=${nextCursor}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDFs from Cloudinary");
      }

      const data = await response.json();
      console.log(`[DEBUG] Retrieved ${data.resources.length} PDFs.`);

      // Filter only PDFs from the 'protilipi' folder
      const protilipiFiles = data.resources.filter(
        (file) => file.asset_folder === "protilipi" && file.resource_type === "raw"
      );
      console.log(`[DEBUG] Filtered ${protilipiFiles.length} PDFs from 'protilipi' folder.`);

      allFiles = allFiles.concat(protilipiFiles);
      nextCursor = data.next_cursor || null; // Continue fetching if there's more data
    } while (nextCursor);

    console.log(`[DEBUG] Total PDFs fetched from 'protilipi' folder: ${allFiles.length}`);

    return NextResponse.json({ success: true, files: allFiles });
  } catch (error) {
    console.error("[ERROR] Error fetching PDFs:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs. Please try again." },
      { status: 500 }
    );
  }
}
