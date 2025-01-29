"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const [stories, setStories] = useState([]); // ✅ Default to an empty array
  const [status, setStatus] = useState(null);

  // ✅ Fetch stories from Cloudinary
  const fetchStories = async () => {
    console.log("[DEBUG] Fetching stories...");
    try {
      const response = await fetch("/api/cloudinary/fetchStories", { method: "GET" });
      const result = await response.json();
      console.log("[DEBUG] Fetch stories response:", result);

      // ✅ Ensure "images" key exists before setting state
      if (result.success && Array.isArray(result.images)) {
        setStories(result.images);
        console.log("[DEBUG] Stories successfully fetched:", result.images);
      } else {
        console.error("[ERROR] No images found:", result.error || "Empty response");
        setStories([]); // ✅ Ensure it's always an array
      }
    } catch (error) {
      console.error("[ERROR] Fetching stories failed:", error);
      setStories([]); // ✅ Ensure stories is always an array
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // ✅ Cloudinary Upload Widget
  const openCloudinaryWidget = async () => {
    try {
      const response = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: "protilipi", // ✅ Ensure the correct folder
          uploadPreset: "protilipi",
        }),
      });

      const { signature, timestamp } = await response.json();

      if (!(window).cloudinary) {
        alert("Cloudinary widget is not available");
        return;
      }

      const widget = (window).cloudinary.createUploadWidget(
        {
          cloudName: "dugx8scku",
          uploadPreset: "protilipi",
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder: "protilipi", // ✅ Ensure the correct folder
          apiKey: "858892213842935",
          resourceType: "image",
        },
        (error, result) => {
          if (!error && result.event === "success") {
            console.log("Upload successful:", result.info);
            fetchStories(); // Refresh the list after upload
          } else if (error) {
            console.error("Upload failed:", error);
          }
        }
      );


      widget.open();
    } catch (error) {
      console.error("Error opening Cloudinary widget:", error);
    }
  };

  return (
    <div className="flex flex-col items-center m-6 gap-4">
      <h1 className="text-2xl font-bold mb-4">Upload and View Stories</h1>

      {/* ✅ Cloudinary Upload Button */}
      <button
        onClick={openCloudinaryWidget}
        className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Upload New Story
      </button>

      {/* ✅ Render Stories */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {stories.length > 0 ? (
          stories.map((story, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-start"
            >
              <h2 className="text-lg font-bold mb-2">
                {story.context?.custom?.title || `Story ${index + 1}`}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Uploaded on: {story.created_at ? new Date(story.created_at).toLocaleDateString() : "Unknown Date"}
              </p>
              <Link href={story.secure_url} target="_blank" className="text-blue-500">
                View File
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No stories available. Please upload one!</p>
        )}
      </div>
    </div>
  );
}
