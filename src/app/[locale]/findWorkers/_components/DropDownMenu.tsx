"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const CategoriesDropDown = ({
  label,
  categoriesArray,
  setSelectedCategories,
  categoriesValues,
  setCategoriesValues,
  notFoundText,
  inputPlaceHolder,
}: CategoriesDropDownProps) => {
  const [open, setOpen] = React.useState(false);
  const handleOnSelectCategory = (category: string) => {
    setCategoriesValues(category);
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[200px] justify-between"
        >
          {categoriesValues
            ? categoriesArray?.find(
                (category) => category.name.trim() === categoriesValues
              )?.name
            : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[200px] p-0">
        <Command>
          <CommandInput placeholder={inputPlaceHolder} className="h-9" />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {categoriesArray?.map((category, index) => (
                <CommandItem
                  key={index}
                  value={category.name}
                  onSelect={() => handleOnSelectCategory(category.name)}
                >
                  {category.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      categoriesValues === category.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const CitiesDropDown = ({
  label,
  cities,
  notFoundText,
  inputPlaceHolder,
  citiesValue,
  setCitiesValue,
  handleSelectCity,
}: CitiesDropDownProps) => {
  const [open, setOpen] = React.useState(false);
  const handleOnSelectCity = (city: string) => {
    setCitiesValue(city === "All" ? "" : city);
    handleSelectCity(city);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[200px] justify-between"
        >
          {citiesValue ? cities.find((item) => item === citiesValue) : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full md:w-[200px]">
        <Command>
          <CommandInput placeholder={inputPlaceHolder} className="h-9" />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {cities.map((city, index) => (
                <CommandItem
                  key={index}
                  value={city}
                  onSelect={() => handleOnSelectCity(city)}
                >
                  {city}
                  <Check
                    className={cn(
                      "ml-auto",
                      citiesValue === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
