"use client";

import React, { useState, useMemo, forwardRef } from "react";
import {
  CheckCircleIcon,
  FileIcon,
  Trash2Icon,
  UploadCloudIcon,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";

const variants = {
  base: "relative rounded-md p-4 w-96 flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-300 transition-colors duration-200 ease-in-out",
  active: "border-2",
  disabled:
    "bg-gray-700 border-white/20 cursor-default pointer-events-none bg-opacity-30",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

const ERROR_MESSAGES = {
  fileTooLarge: (maxSize) =>
    `The file is too large. Max size is ${formatFileSize(maxSize)}.`,
  fileInvalidType: () => "Invalid file type. Only PDF files are allowed.",
  tooManyFiles: (maxFiles) => `You can only add ${maxFiles} file(s).`,
  fileNotSupported: () => "The file is not supported.",
};

const MultiFileDropzone = forwardRef((props, ref) => {
  const {
    dropzoneOptions,
    value,
    className,
    disabled: isDisabled,
    onFilesAdded,
    onChange,
  } = props;

  const [customError, setCustomError] = useState();

  const disabled = useMemo(() => {
    if (dropzoneOptions?.maxFiles && value?.length) {
      return isDisabled ?? value.length >= dropzoneOptions.maxFiles;
    }
    return isDisabled;
  }, [dropzoneOptions?.maxFiles, value?.length, isDisabled]);

  const {
    getRootProps,
    getInputProps,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "application/pdf": [] }, // Only allow PDF files
    disabled,
    multiple: true, // Enable multiple file uploads
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles;
      setCustomError(undefined);
      if (
        dropzoneOptions?.maxFiles &&
        (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
      ) {
        setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
        return;
      }
      if (files) {
        const addedFiles = files.map((file) => ({
          file,
          key: Math.random().toString(36).slice(2),
          progress: "PENDING",
        }));
        onFilesAdded?.(addedFiles);
        onChange?.([...(value ?? []), ...addedFiles]);
      }
    },
    ...dropzoneOptions,
  });

  const dropZoneClassName = useMemo(
    () =>
      twMerge(
        variants.base,
        isFocused && variants.active,
        disabled && variants.disabled,
        (isDragReject || fileRejections[0]) && variants.reject,
        isDragAccept && variants.accept,
        className
      ).trim(),
    [isFocused, fileRejections, isDragAccept, isDragReject, disabled, className]
  );

  const errorMessage = useMemo(() => {
    if (fileRejections[0]) {
      const { errors } = fileRejections[0];
      if (errors[0]?.code === "file-too-large") {
        return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
      } else if (errors[0]?.code === "file-invalid-type") {
        return ERROR_MESSAGES.fileInvalidType();
      } else if (errors[0]?.code === "too-many-files") {
        return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
      } else {
        return ERROR_MESSAGES.fileNotSupported();
      }
    }
    return undefined;
  }, [fileRejections, dropzoneOptions]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div>
          {/* Main Dropzone */}
          <div {...getRootProps({ className: dropZoneClassName })}>
            <input ref={ref} {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-xs text-gray-400">
              <UploadCloudIcon className="mb-1 h-7 w-7" />
              <div className="text-gray-400">
                Drag & drop or click to upload PDF files
              </div>
              <div className="text-xs text-gray-500">
                Max file size: {formatFileSize(dropzoneOptions?.maxSize || 0)}
              </div>
            </div>
          </div>
          {/* Error Display */}
          <div className="mt-1 text-xs text-red-500">
            {customError ?? errorMessage}
          </div>
        </div>

        {/* File List */}
        {value?.map(({ file, progress }, i) => (
          <div
            key={i}
            className="flex h-16 w-96 flex-col justify-center rounded border border-solid border-gray-300 px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <FileIcon size="30" />
              <div className="min-w-0 text-sm">
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <div className="grow" />
              <div className="flex w-12 justify-end text-xs">
                {progress === "PENDING" ? (
                  <button
                    className="rounded-md border-none bg-transparent p-1 hover:bg-gray-100"
                    onClick={() => {
                      onChange?.(value.filter((_, index) => index !== i));
                    }}
                  >
                    <Trash2Icon />
                  </button>
                ) : progress === "COMPLETE" ? (
                  <CheckCircleIcon className="text-green-500" />
                ) : (
                  <div>{Math.round(progress)}%</div>
                )}
              </div>
            </div>
            {typeof progress === "number" && (
              <div className="relative h-1 w-full bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded transition-all"
                  style={{
                    width: progress ? `${progress}%` : "0%",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
MultiFileDropzone.displayName = "MultiFileDropzone";

function formatFileSize(bytes) {
  if (!bytes) return "0 Bytes";
  bytes = Number(bytes);
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export { MultiFileDropzone };
