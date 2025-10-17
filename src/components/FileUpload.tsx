// components/FileUpload.tsx
"use client";

import { useState } from "react";
import { Input } from "./ui/input";

interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
}
interface FileUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export default function FileUpload({
  files,
  setFiles,
  uploadedFiles,
  setUploadedFiles,
}: FileUploadProps) {
  //   const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  //   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFiles = Array.from(e.target.files || []);

    // Validate file count
    if (files.length + selectedFiles.length > 3) {
      setError("You can only upload up to 3 files");
      return;
    }

    // Validate file types
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
    ];
    const invalidFiles = selectedFiles.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Only images (JPEG, PNG, GIF) and PDFs are allowed");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <Input
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFileChange}
          disabled={files.length >= 3 || uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <p className="mt-2 text-sm text-gray-500">
          Upload up to 3 images or PDFs ({files.length}/3)
        </p>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">Selected Files:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button> */}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Uploaded Files:</h3>
          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border rounded p-3">
                <p className="text-sm font-medium">{file.fileName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Type: {file.fileType}
                </p>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View File
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
