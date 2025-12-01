"use client";

import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";
import { date } from "zod";
import Cards from "./_components/Cards";
import {
  FormBudgetStep,
  FormDetailsStep,
  FormLocationStep,
  FormScheduleStep,
} from "./_components/FormSteps";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormProgressBar } from "./_components/FormProgressBar";
import FileUpload from "./_components/FormPhotosStep";
import { postWork } from "@/actions/workPost.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
interface FileObject {
  name: string;
  size: string;
  type: string;
  id: string;
}
export interface JobPosting {
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  isUrgent: boolean;
  price: number | "unknown";
  photos: File[];
  categories: string[];
  workSiteLink: string;
  location: {
    address: string;
    lat: number;
    lgn: number;
    city?: string;
    postalCode?: string;
  };
  age?: number;
  phoneNumber?: string;
}
const STEPS = [
  "Job Details",
  "Schedule",
  "Budget",
  "Location",
  "Photos & Review",
];
const page = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<JobPosting>({
    description: "",
    startDate: undefined,
    endDate: undefined,
    isUrgent: false,
    price: "unknown",
    workSiteLink: "",
    photos: files,
    categories: [],
    location: {
      address: "",
      lat: 0,
      lgn: 0,
      city: "",
      postalCode: "",
    },
  });

  // const formSchema =

  const [priceType, setPriceType] = useState<"known" | "unknown">("unknown");
  const [priceValue, setPriceValue] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handlePriceTypeChange = (value: "known" | "unknown") => {
    setPriceType(value);
    if (value === "unknown") {
      setFormData({ ...formData, price: "unknown" });
      setPriceValue("");
    }
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setFiles([]);
      toast.success("Files uploaded successfully!");
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      console.error(err);
    }
  };

  const handlePriceValueChange = (value: string) => {
    setPriceValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData({ ...formData, price: numValue });
    }
  };
  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    switch (step) {
      case 1: // Job Details
        if (!formData.description.trim()) {
          newErrors.push("Job description is required");
        }
        if (formData.categories.length === 0) {
          newErrors.push("At least one worker category is required");
        }
        break;

      case 2: // Schedule
        if (!formData.startDate) {
          newErrors.push("Start date is required");
        }
        if (!formData.endDate) {
          newErrors.push("End date is required");
        }
        if (
          formData.startDate &&
          formData.endDate &&
          formData.startDate > formData.endDate
        ) {
          newErrors.push("End date must be after start date");
        }
        break;

      case 3: // Budget
        // Budget is optional or can be "unknown", so no validation needed
        if (priceType === "known" && !priceValue) {
          newErrors.push("Please enter a valid price Or select other option");
        }
        break;

      case 4: // Location
        if (!formData.location.lat || !formData.location.lgn) {
          newErrors.push("Please select a valid location from the map");
        }
        if (!formData.location.address.trim()) {
          newErrors.push("Address is required");
        }

        break;

      case 5: // Photos & Review
        // Photos are optional, no validation needed
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      setErrors([]);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors([]);
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormDetailsStep formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <FormScheduleStep formData={formData} setFormData={setFormData} />
        );
      case 3:
        return (
          <FormBudgetStep
            priceType={priceType}
            priceValue={priceValue}
            handlePriceValueChange={handlePriceValueChange}
            handlePriceTypeChange={handlePriceTypeChange}
          />
        );
      case 4:
        return (
          <FormLocationStep formData={formData} setFormData={setFormData} />
        );
      case 5:
        return (
          <FileUpload
            setFormData={setFormData}
            files={files}
            setFiles={setFiles}
          />
        );
      default:
        return null;
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await postWork(formData);
      if (!res?.success) {
        toast.error(res?.message || "Error posting job");
        return;
      }
      // console.log(formData);
      if (files.length !== 0) {
        handleUpload();
      }
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Error submitting the form");
    } finally {
      setLoading(false);
    }
    // console.log(formData);
  };

  return (
    <section className="w-full">
      <header className="border p-5">
        <div className="flex gap-5">
          <div className="size-12 bg-primary/60 rounded-lg flex items-center justify-center">
            <Briefcase size={25} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-xl">Post a Job</h1>
            <p className="text-muted-foreground">
              find skilled workers for your project{" "}
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Cards />

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <FormProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {isSubmitted && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="size-4 text-green-600" />
              <AlertDescription className="text-green-900">
                Job posted successfully! Workers will be notified about your
                request.
              </AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          <div className="min-h-[400px] border p-4 rounded-lg shadow-md dark:shadow-black/50">
            {renderStep()}
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>

            <div className="text-zinc-600 text-sm">
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                variant={"action"}
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="gap-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    Post Job
                    <CheckCircle2 className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </main>
    </section>
  );
};

export default page;
