"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const [files, setFiles] = useState([]); // Store the fetched files (PDFs)
  const [status, setStatus] = useState(null);

  // Fetch PDF files from Cloudinary
  const fetchFiles = async () => {
    console.log("[DEBUG] Fetching PDFs...");
    try {
      const response = await fetch("/api/cloudinary/fetchFiles", { method: "GET" });
      const result = await response.json();
      console.log("[DEBUG] Fetch files response:", result);

      if (result.success && Array.isArray(result.files)) {
        setFiles(result.files); // Populate files with fetched PDFs
        console.log("[DEBUG] Files successfully fetched:", result.files);
      } else {
        console.error("[ERROR] No files found:", result.error || "Empty response");
        setFiles([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("[ERROR] Fetching files failed:", error);
      setFiles([]); // Ensure files is always an array
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Cloudinary Upload Widget for PDFs
  const openCloudinaryWidget = async () => {
    try {
      const response = await fetch("/api/cloudinary/signaturePDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: "protilipi", // Ensure the correct folder
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
          folder: "protilipi", // Ensure the correct folder
          apiKey: "858892213842935",
          resourceType: "raw", // Allow PDF (raw files)
        },
        (error, result) => {
          if (!error && result.event === "success") {
            console.log("Upload successful:", result.info);
            fetchFiles(); // Refresh the list after upload
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
      <h1 className="text-2xl font-bold mb-4">Upload and View PDFs</h1>

      {/* Cloudinary Upload Button */}
      <button
        onClick={openCloudinaryWidget}
        className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Upload New PDF
      </button>

      {/* Render Files (PDFs) */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-start"
            >
              <h2 className="text-lg font-bold mb-2">
                {file.context?.custom?.title || `PDF ${index + 1}`}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Uploaded on: {file.created_at ? new Date(file.created_at).toLocaleDateString() : "Unknown Date"}
              </p>
              <Link href={file.secure_url} target="_blank" className="text-blue-500">
                View PDF
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No PDFs available. Please upload one!</p>
        )}
      </div>
    </div>
  );
}
