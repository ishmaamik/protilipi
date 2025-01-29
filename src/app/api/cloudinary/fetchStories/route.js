import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[DEBUG] Fetching images from Cloudinary...");

    let allImages = [];
    let nextCursor = null;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    do {
      // Fetch all images, regardless of the folder
      let url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?context=true&max_results=100`;

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
        throw new Error("Failed to fetch images from Cloudinary");
      }

      const data = await response.json();
      console.log(`[DEBUG] Retrieved ${data.resources.length} images.`);

      // Filter only images from 'protilipi' folder
      const protilipiImages = data.resources.filter(
        (image) => image.asset_folder === "protilipi"
      );
      console.log(`[DEBUG] Filtered ${protilipiImages.length} images from 'protilipi' folder.`);

      allImages = allImages.concat(protilipiImages);
      nextCursor = data.next_cursor || null; // Continue fetching if there's more data
    } while (nextCursor);

    console.log(`[DEBUG] Total images fetched from 'protilipi' folder: ${allImages.length}`);

    return NextResponse.json({ success: true, images: allImages });
  } catch (error) {
    console.error("[ERROR] Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images. Please try again." },
      { status: 500 }
    );
  }
}
