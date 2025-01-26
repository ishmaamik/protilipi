"use client";

import { MultiFileDropzone } from "@/components/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [fileStates, setFileStates] = useState([]);
  const [urls, setUrls] = useState([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key, progress) {
    setFileStates((fileStates) => {
      const newFileStates = JSON.parse(JSON.stringify(fileStates)); // Use JSON cloning
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div className="flex flex-col items-center m-6 gap-2">
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.myProtectedFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                setUrls((prevUrls) => [...prevUrls, res.url]);
                console.log(res);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      />
      {urls.map((url, index) => (
        <Link key={index} href={url} target="_blank">
          URL{index + 1}
        </Link>
      ))}
    </div>
  );
}
