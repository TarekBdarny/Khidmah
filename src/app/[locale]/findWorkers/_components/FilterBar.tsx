"use client";
import { getAllWorkersCities } from "@/actions/worker.action";
import React, { useEffect, useState } from "react";
import { CitiesDropDown, CategoriesDropDown } from "./DropDownMenu";
import { fetchCategoriesByLocale } from "@/actions/category.action";
import { useLocale } from "next-intl";
import StatusToggle from "./StatusToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FilterBar = ({
  setSelectedCategories,
  setSelectedCity,
  setSelectStatus,
  selectStatus,
  results,
  handleReset,
  citiesValue,
  setCitiesValue,
  categoriesValues,
  setCategoriesValues,
  setReset,
  reset,
}: FilterBarProps) => {
  const [workersCity, setWorkersCity] = useState<Cities>([]);
  const [workCategories, setWorkCategories] = useState<
    DropDownCategory[] | undefined
  >([]);

  const locale = useLocale();
  const handleSelectCategories = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };
  const handleSelectCity = (city: string) =>
    setSelectedCity(city === "All" ? "" : city);

  useEffect(() => {
    const fetchWorkersCity = async () => {
      const res = await getAllWorkersCities();
      setWorkersCity(res!);
    };
    const fetchAllCategories = async () => {
      const res = await fetchCategoriesByLocale(locale);
      setWorkCategories(res);
    };
    fetchWorkersCity();
    fetchAllCategories();
  }, []);
  const citiesDorpDownProps = {
    label: "City",
    cities: workersCity,
    handleSelectCity,
    handleReset,
    citiesValue,
    setCitiesValue,
    notFoundText: "No cities found",
    inputPlaceHolder: "City",
  };
  const categoriesDorpDownProps = {
    label: "Category",
    categoriesArray: workCategories,
    handleSelectCategories,
    categoriesValues,
    setCategoriesValues,
    setSelectedCategories,
    setReset,
    reset,
    notFoundText: "No Categories found",
    inputPlaceHolder: "Search work",
  };
  return (
    <section className="w-full">
      <div className="flex flex-col gap-2  ">
        {/* <DropDownMenu {...citiesDorpDownProps} /> */}
        <div className="flex flex-col md:flex-row gap-2">
          <CategoriesDropDown {...categoriesDorpDownProps} />
          <CitiesDropDown {...citiesDorpDownProps} />
          <StatusToggle
            setSelectStatus={setSelectStatus}
            selectStatus={selectStatus}
          />
          <Button variant={"action"} onClick={handleReset}>
            Reset
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing
          <span className="text-primary"> {results} </span>
          Worker{results === 1 ? "" : "s"}
        </p>
      </div>
    </section>
  );
};

export default FilterBar;
