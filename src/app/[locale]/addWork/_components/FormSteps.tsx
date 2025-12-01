import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobPosting } from "../page";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarIcon, DollarSign, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import WorkDropDown from "./WorkDropDown";
import GoogleMapsLocationSelector from "./Map";
import InputWithLabel from "@/components/reuseable/InputWithLabel";
type FormDetailsStepProps = {
  formData: JobPosting;
  setFormData: React.Dispatch<React.SetStateAction<JobPosting>>;
};
type FormBudgetStepProps = {
  priceType: string;
  handlePriceTypeChange: (value: "known" | "unknown") => void;
  priceValue: string;
  handlePriceValueChange: (value: string) => void;
};
export const FormDetailsStep = ({
  formData,
  setFormData,
}: FormDetailsStepProps) => {
  const handleDescriptionSetter = (value: string) => {
    setFormData({ ...formData, description: value });
  };
  return (
    <div className="space-y-8">
      {/* Job Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="">
          Job Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the work that needs to be done in detail..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="min-h-32 resize-none"
        />

        <p className="text-muted-foreground text-sm">
          Be as detailed as possible to help workers understand the scope of
          work
        </p>
      </div>

      {/* Worker Categories */}
      <WorkDropDown setFormData={setFormData} formData={formData} />
    </div>
    // <div className="space-y-8">Details Step Content Here</div>
  );
};
export const FormScheduleStep = ({
  formData,
  setFormData,
}: FormDetailsStepProps) => {
  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span className="text-zinc-500">Pick a start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) =>
                  setFormData({ ...formData, startDate: date })
                }
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3">
          <Label className="">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 size-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span className="text-zinc-500">Pick an end date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData({ ...formData, endDate: date })}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Urgent Checkbox */}
      <div className="flex items-center space-x-2 p-4 rounded-lg border-1 border-muted-foreground ">
        <Checkbox
          id="urgent"
          checked={formData.isUrgent}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isUrgent: checked as boolean })
          }
        />
        <label htmlFor="urgent" className=" cursor-pointer flex-1">
          <span className="flex items-center gap-2">
            <AlertCircle className="size-5 text-amber-600" />
            This is an urgent job (needs immediate attention)
          </span>
        </label>
      </div>
    </div>
    // <div>Schedule Step Content Here</div>
  );
};
export const FormBudgetStep = ({
  priceType,
  handlePriceTypeChange,
  priceValue,
  handlePriceValueChange,
}: FormBudgetStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="">Budget</Label>
        <RadioGroup value={priceType} onValueChange={handlePriceTypeChange}>
          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-zinc-200 hover:border-zinc-300 transition-colors">
            <RadioGroupItem value="known" id="price-known" />
            <Label htmlFor="price-known" className="cursor-pointer flex-1">
              I have a specific budget
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-zinc-200 hover:border-zinc-300 transition-colors">
            <RadioGroupItem value="unknown" id="price-unknown" />
            <Label htmlFor="price-unknown" className="cursor-pointer flex-1">
              I'm not sure yet (will discuss with workers)
            </Label>
          </div>
        </RadioGroup>

        {priceType === "known" && (
          <div className="relative mt-4">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              type="number"
              placeholder="Enter your budget"
              value={priceValue}
              onChange={(e) => handlePriceValueChange(e.target.value)}
              className="pl-9"
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          <strong>Tip:</strong> If you're unsure about the budget, select "not
          sure yet" and workers will provide quotes based on your job
          description.
        </p>
      </div>
    </div>
    // <div>Budget Step Content Here</div>
  );
};
export const FormLocationStep = ({
  formData,
  setFormData,
}: FormDetailsStepProps) => {
  return (
    <div className="space-y-4">
      <GoogleMapsLocationSelector setFormData={setFormData} />
    </div>
  );
};
