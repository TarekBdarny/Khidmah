// components/FileUpload.tsx
"use client";

import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { Trash, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobPosting } from "../page";

interface FileObject {
  name: string;
  size: string;
  type: string;
  id: string;
}
interface FileUploadProps {
  setFormData: React.Dispatch<React.SetStateAction<JobPosting>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
export default function FileUpload({
  setFormData,
  files,
  setFiles,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  // const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photos: files,
    }));
  }, [files]);
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]): void => {
    if (files.length + newFiles.length > 4) {
      toast.error("You can upload a maximum of 4 images.");
      return;
    }

    const validFiles = newFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  return (
    <div>
      <p className="text-muted-foreground mb-4">
        Add Photos that describe your work for the workers
      </p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
          isDragging
            ? "border bg-purple-500/20 scale-105"
            : "border bg-white/5 backdrop-blur-sm hover:border-primary hover:bg-white/10"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          id="file-upload"
        />

        <div className="p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div
              className={`p-6 rounded-full transition-all duration-300 ${
                isDragging ? "bg-primary scale-110" : "bg-primary/80"
              }`}
            >
              <Upload className="w-12 h-12 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-semibold  mb-2">
            {isDragging ? "Drop files here" : "Choose files or drag them here"}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Support for all image types • Max size 10MB per file
          </p>

          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-gradient-to-l 
            
            from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold  rounded-xl transition-all duration-300 items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-[0.98]
            "
          >
            Browse Files
          </label>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2  rounded-lg">
          <h3 className="text-sm font-medium">Selected Files:</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between  py-2 px-4 border shadow-sm  rounded-lg"
            >
              <Button
                variant={"ghost"}
                onClick={() => removeFile(index)}
                disabled={uploading}
                className="ml-2 text-red-600 hover:text-red-800 text-sm"
              >
                <Trash className="w-4 h-4" />
              </Button>
              <span className="text-sm truncate">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
{
  /* <div className="max-w-2xl mx-auto p-6">
      <div className="border rounded-lg p-6">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={files.length >= 3 || uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:cursor-pointer transition duration-300 file:text-sm file:font-semibold file:bg-muted file:text-primary hover:file:bg-primary hover:file:text-white"
        />

        <p className="mt-2 text-sm text-gray-500">
          Upload up to 3 images ({files.length}/3)
        </p>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-2  rounded-lg">
            <h3 className="text-sm font-medium">Selected Files:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted  rounded"
              >
                <Button
                  variant={"ghost"}
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <span className="text-sm truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div> */
}
