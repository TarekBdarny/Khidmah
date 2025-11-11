"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { HelpCircle, RotateCcw, Send, X } from "lucide-react";
import { arabicDays, hebrewDays, storeSkills, storeWeekdays } from "@/store";
import { useTranslations } from "next-intl";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { usePathname } from "next/navigation";
import { fetchCategoriesByLocale } from "@/actions/category.action";
import { SelectGroup } from "@radix-ui/react-select";
import FileUpload from "./FileUpload";
import { sendWorkerRequestToSystem } from "@/actions/workerRequest.action";
import { toast } from "sonner";
import { WhyYouWantToWorkWithUsDialog } from "./FormDialog";
import { fa } from "zod/v4/locales";
import { Textarea } from "./ui/textarea";
type categoriesType = Awaited<ReturnType<typeof fetchCategoriesByLocale>>;
interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
}

const BecomeWorkerForm = () => {
  const t = useTranslations("BecomeWorkerForm");
  // const attachmentsInputRef = useRef<HTMLInputElement | null>(null);
  const locale = usePathname().split("/")[1];
  const weekDays = locale === "he" ? hebrewDays : arabicDays;
  const [localeCategories, setLocalCategories] = useState<categoriesType>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await fetchCategoriesByLocale(locale);
      setLocalCategories(categories);
    };
    fetchCategories();
  }, [locale]);
  const formSchema = z.object({
    companyName: z
      .string()
      .min(5, t("companyNameMinError"))
      .max(25, t("companyNameMaxError")),
    yearsOfExperience: z.string(),
    maxWorkDistance: z.string(),
    // .number()
    // .min(1, "Max work distance must be at least 1 km")
    // .max(500),
    areasOfExperience: z.array(z.string()),
    startTime: z.string(),
    endTime: z.string(),
    offDays: z.array(z.string()),
    attachments: z.array(z.file()),
    message: z.string().optional(),
  });
  const skills = storeSkills;
  const [selectedOffDays, setSelectedOffDays] = React.useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = React.useState<string[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      yearsOfExperience: "",
      maxWorkDistance: "",
      areasOfExperience: [],
      startTime: "",
      endTime: "",
      offDays: [],
      message: "",
      attachments: files,
    },
  });
  useEffect(() => {
    form.setValue("offDays", selectedOffDays);
  }, [selectedOffDays]);

  useEffect(() => {
    form.setValue("areasOfExperience", selectedExperience);
  }, [selectedExperience]);

  useEffect(() => {
    form.setValue("attachments", files);
  }, [files]);

  const handleUpload = async (requestId: string) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setUploadedFiles(data.attachments);
      setFiles([]);
      toast.success("Files uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      console.error(err);
    }
  };
  const handleDayOffClick = (day: string) => {
    if (selectedOffDays.includes(day)) {
      setSelectedOffDays(selectedOffDays.filter((item) => item !== day));
    } else {
      setSelectedOffDays([...selectedOffDays, day]);
    }
  };
  const handleExperienceChange = (value: string) => {
    setSelectedExperience((prev) => [...prev, value]);
  };
  const handleExperienceRemove = (value: string) => {
    setSelectedExperience((prev) => prev.filter((item) => item !== value));
  };
  const handleContinueClick = () => {
    const { areasOfExperience, companyName, yearsOfExperience } =
      form.getValues();
    if (areasOfExperience.length === 0) {
      toast.error("Please select at least one skill");
      return false;
    }
    if (!companyName) {
      toast.error("Please enter company name");
      return false;
    }
    if (!yearsOfExperience) {
      toast.error("Please enter years of experience");
      return false;
    }
    return true;
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    console.log("hello");
    if (selectedExperience.length === 0) {
      toast.warning("Please select at least one skill");
      return;
    }

    const res = await sendWorkerRequestToSystem(data);
    if (!res?.success) {
      toast.error(res?.message);
      return;
    }
    const requestId = res?.workerRequest?.id;
    if (!requestId) return;
    if (files.length !== 0) {
      handleUpload(requestId);
    }
  };

  return (
    <Card className="w-full  sm:max-w-md  mt-5 ">
      <CardHeader>
        <CardTitle>{t("title")} </CardTitle>
        <CardDescription>
          <span>{t("subTitleFirstSection")}</span>
          <span className="font-semibold text-primary"> Khidma</span>
          <span> {t("subTitleSecondSection")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <form id="request-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="companyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="company name"
                    className="flex items-center justify-between"
                  >
                    {t("companyName")}
                    <HoverCard>
                      <HoverCardTrigger>
                        <Button variant={"ghost"}>
                          <HelpCircle />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        {t("companyNameDescription")}
                      </HoverCardContent>
                    </HoverCard>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="company name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("companyNamePlaceholder")}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="yearsOfExperience"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="years of experience">
                    {t("yearsOfExperience")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="years of experience"
                    aria-invalid={fieldState.invalid}
                    placeholder="5"
                    autoComplete="off"
                    min={0}
                    type="number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="maxWorkDistance"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="max work distance">
                    {t("maxWorkDistance")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="max work distance"
                    aria-invalid={fieldState.invalid}
                    placeholder="5"
                    autoComplete="off"
                    min={0}
                    type="number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div>
              <Controller
                name="offDays"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="Off Days">{t("offDays")}</FieldLabel>
                    {/* <Input
                      {...field}
                      id="Off Days"
                      aria-invalid={fieldState.invalid}
                      placeholder="5"
                      autoComplete="off"
                      min={0}
                      type="number"
                    /> */}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="flex flex-wrap gap-2 items-center my-2">
                {weekDays.map((day) => (
                  <Button
                    value={day}
                    type="button"
                    variant={"outline"}
                    key={day}
                    className={
                      selectedOffDays.includes(day)
                        ? "text-primary scale-105 bg-indigo-300"
                        : "text-white scale-100"
                    }
                    onClick={() => handleDayOffClick(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Controller
                name="startTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="start time">
                      {t("startTime")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="start time"
                      aria-invalid={fieldState.invalid}
                      placeholder="5"
                      autoComplete="off"
                      min={0}
                      type="time"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="endTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="end time">{t("endTime")}</FieldLabel>
                    <Input
                      {...field}
                      id="end time"
                      aria-invalid={fieldState.invalid}
                      placeholder="5"
                      autoComplete="off"
                      min={0}
                      type="time"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div>
              <Controller
                name="areasOfExperience"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="areas of experience">
                      {t("workCategories")}
                    </FieldLabel>
                    <Select
                      dir="rtl"
                      onValueChange={(value) => handleExperienceChange(value)}
                    >
                      <SelectTrigger className="w-[300px] focus:ring-green-500">
                        <SelectValue
                          placeholder={t("selectCategoriesPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="h-52" dir="rlt">
                        <SelectGroup>
                          <SelectLabel>
                            {localeCategories?.length} {t("resultsFound")}
                          </SelectLabel>
                          {localeCategories?.map((category, index) => (
                            <SelectItem key={index} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-row flex-wrap gap-2">
                      {selectedExperience.map((experience) => (
                        <div
                          className="border-1 flex items-center p-2"
                          key={experience}
                        >
                          <p>{experience}</p>
                          <Button
                            variant={"ghost"}
                            className="size-2"
                            onClick={() => handleExperienceRemove(experience)}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="message">
                    Why do you want to work here? (optional)
                  </FieldLabel>
                  <div className="grid gap-3 relative">
                    <FieldDescription>
                      Provide a reason why you want to work with us{" "}
                    </FieldDescription>
                    <Textarea
                      {...field}
                      id="message"
                      name="message"
                      rows={5}
                      cols={10}
                      value={field.value}
                      onChange={handleMessageChange}
                      className="w-full resize-none rounded-lg pb-8 border "
                      // defaultValue="Your website seems a good chance to earn more money"
                    />
                    <p className="text-xs  absolute right-2 bottom-2">
                      <span
                        className={`${
                          field.value?.length && field.value?.length > 140
                            ? "text-red-500"
                            : "text-primary"
                        }`}
                      >
                        {field.value?.length && field.value.length}
                      </span>
                      /150{" "}
                    </p>
                  </div>
                </Field>
              )}
            /> */}

            <Controller
              name="attachments"
              control={form.control}
              render={({ field, fieldState }) => (
                <FileUpload
                  files={files}
                  setFiles={setFiles}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
                // <Field data-invalid={fieldState.invalid}>
                //   <FieldLabel htmlFor="attachments">choose files</FieldLabel>
                // </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {t("reset")}
            <RotateCcw />
            <span className="sr-only">{t("reset")}</span>
          </Button>
          <Button type="submit" variant={"action"} form="request-form">
            {t("submit")}
            <Send />
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default BecomeWorkerForm;
