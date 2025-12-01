"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { JobPosting } from "../page";
import { fetchCategoriesByLocale } from "@/actions/category.action";
import { usePathname } from "next/navigation";
import CategoryBadge from "@/components/reuseable/CategoryBadge";
type categoriesType = Awaited<ReturnType<typeof fetchCategoriesByLocale>>;
type DropDownProps = {
  formData: JobPosting;
  setFormData: React.Dispatch<React.SetStateAction<JobPosting>>;
};
const WorkDropDown = ({ formData, setFormData }: DropDownProps) => {
  const [categories, setCategories] = React.useState<categoriesType>([]);
  const locale = usePathname().split("/")[1];
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetchCategoriesByLocale(locale);
      setCategories(data);
    };
    fetchCategories();
  }, [locale]);

  const handleCategorySelect = (categoryName: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        categories: [...prev.categories, categoryName],
      };
    });
  };
  const handleRemoveCategory = (categoryName: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryName),
    }));
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <p>Work Categories</p>
            <span className="text-red-500">*</span>
          </div>
          {formData.categories.length === 0 ? null : (
            <p className="text-sm text-muted-foreground">
              {formData.categories.length} selected
            </p>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Select all types of workers needed for this job
        </p>
      </div>
      <Select onValueChange={(value) => handleCategorySelect(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select work categories" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* selected categories */}
      <div className="flex flex-wrap gap-2">
        {formData.categories.map((category, index) => (
          <CategoryBadge
            key={index}
            category={category}
            handleRemoveCategory={handleRemoveCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkDropDown;
