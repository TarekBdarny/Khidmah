"use client";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFormContext } from "react-hook-form";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
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
      attachments: files,
    },
  });
  // const { control, setValue, watch } = useFormContext();
  useEffect(() => {
    form.setValue("offDays", selectedOffDays);
  }, [selectedOffDays]);

  useEffect(() => {
    form.setValue("areasOfExperience", selectedExperience);
  }, [selectedExperience]);

  useEffect(() => {
    form.setValue("attachments", files);
  }, [files]);

  const handleUpload = async () => {
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
      alert("Files uploaded successfully!");
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
  // const handleClick = () => {
  //   attachmentsInputRef.current?.click();
  // };
  // const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = event.target.files
  //     ? Array.from(event.target.files)
  //     : [];
  //   const newFiles = [...files, ...selectedFiles];
  //   setFiles(newFiles);
  //   form.setValue("attachments", newFiles, { shouldValidate: true });
  // };

  // const removeFile = (index: number) => {
  //   const newFiles = [...files];
  //   newFiles.splice(index, 1);
  //   setFiles(newFiles);
  //   form.setValue("attachments", newFiles, { shouldValidate: true });
  // };
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    if (selectedExperience.length === 0) {
      toast.warning("Please select at least one skill");
      return;
    }
    if (files.length !== 0) {
      console.log("in uploading");
      handleUpload();
      console.log("after uploading");
    }

    sendWorkerRequestToSystem(data);
  };
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{t("title")} </CardTitle>
        <CardDescription>
          <span>{t("subTitleFirstSection")}</span>
          <span className="font-semibold text-primary"> Khidma</span>
          <span> {t("subTitleSecondSection")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
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

            <Controller
              name="attachments"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="attachments">choose files</FieldLabel>
                  <FileUpload
                    files={files}
                    setFiles={setFiles}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                  />
                </Field>
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
            <span className="sr-only"> {t("submit")}</span>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default BecomeWorkerForm;
