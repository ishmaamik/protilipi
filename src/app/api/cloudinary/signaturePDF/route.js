import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    console.log("[DEBUG] Signature generation started...");
    const { folder, uploadPreset } = await request.json();
    console.log("[DEBUG] Request body:", { folder, uploadPreset });

    const timestamp = Math.round(new Date().getTime() / 1000);
    console.log("[DEBUG] Timestamp:", timestamp);

    const paramsToSign = {
      folder: folder || "protilipi", // Default to 'protilipi' if not provided
      upload_preset: uploadPreset,
      timestamp,
      source: "uw", // Source: 'uw' for upload widget
    };

    const stringToSign = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");
    console.log("[DEBUG] String to sign:", stringToSign);

    const signature = crypto
      .createHash("sha256")
      .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    console.log("[DEBUG] Generated signature:", signature);
    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    console.error("[ERROR] Error generating signature:", error);
    return NextResponse.json({ error: "Failed to generate signature." }, { status: 500 });
  }
}
