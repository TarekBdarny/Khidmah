"use client";
import React, { useEffect, useState } from "react";
import FilterBar from "./_components/FilterBar";
import { getWorkersExplicit } from "@/actions/worker.action";
import WorkerCard from "./_components/WorkerCard";
import { SkeletonCard, SkeletonSidebarCard } from "./_components/SkeletonCard";
import SidebarCard from "./_components/SidebarCard";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyWorkers } from "../chat/components/empty-components";
type Workers = Awaited<ReturnType<typeof getWorkersExplicit>>;
export type Worker = Workers["data"][0];
const page = () => {
  const [workers, setWorkers] = useState<Worker[]>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectStatus, setSelectStatus] = useState<string>("All");
  const [citiesValue, setCitiesValue] = React.useState<string>("");
  const [categoriesValues, setCategoriesValues] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedCity("");
    setSelectStatus("All");
    setCategoriesValues("");
    setCitiesValue("");
    setReset(true);
  };
  const handleRemoveCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((item) => item !== category));
    setCategoriesValues("");
  };
  const barProps = {
    setSelectedCategories,
    setSelectedCity,
    setSelectStatus,
    selectStatus,
    categoriesValues,
    setCategoriesValues,
    handleReset,
    citiesValue,
    setCitiesValue,
    results: workers?.length,
    reset,
    setReset,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchWorkers = async () => {
        setLoading(true);
        const res = await getWorkersExplicit(
          selectedCity,
          selectedCategories,
          selectStatus
        );
        if (res?.success) {
          setWorkers(res.data);
        }
        setLoading(false);
      };
      fetchWorkers();
    }, 300); // Wait 300ms after last change

    return () => clearTimeout(timer);
  }, [selectedCategories, selectedCity, selectStatus]);
  return (
    <section className="w-full p-4">
      {/* Filter Bar - Full Width at Top */}
      <div className="mb-6">
        <FilterBar {...barProps} />
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((category, index) => (
            <Badge key={index} variant={"outline"} className=" text-sm  ">
              {category}
              <Button
                variant={"ghost"}
                onClick={() => handleRemoveCategory(category)}
              >
                <X className=" size-4" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 9 cols on large devices */}
        <div className="lg:col-span-9">
          {/* Your main content here */}
          <div
            className={`${
              workers?.length !== 0
                ? "rounded-lg shadow grid grid-cols-1 lg:grid-cols-2 p-2 gap-2"
                : "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            } `}
          >
            {!loading && workers?.length === 0 && <EmptyWorkers />}
            {!loading &&
              workers?.length !== 0 &&
              workers?.map((worker) => (
                <WorkerCard key={worker.id} {...worker} />
              ))}
            {!loading &&
              workers?.length !== 0 &&
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </div>
        </div>

        {/* Right Column - 3 cols on large devices */}
        {loading ? (
          <div className="lg:col-span-3">
            <SkeletonSidebarCard />
            <SkeletonSidebarCard />
            <SkeletonSidebarCard />
          </div>
        ) : (
          <div
            className={` ${workers?.length === 0 ? "hidden" : "lg:col-span-3"}`}
          >
            {/* Your sidebar content here */}
            <div className="border-1 rounded-lg shadow ">
              {/* Sidebar content */}
              <SidebarCard
                id="33434"
                companyName="The Company"
                user={{
                  firstName: "John",
                  lastName: "Doe",
                  profilePic: "",
                  id: "123",
                }}
              />
              <SidebarCard
                id="33434"
                companyName="The Company"
                user={{
                  firstName: "John",
                  lastName: "Doe",
                  profilePic: "",
                  id: "123",
                }}
              />
              <SidebarCard
                id="33434"
                companyName="The Company"
                user={{
                  firstName: "John",
                  lastName: "Doe",
                  profilePic: "",
                  id: "123",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default page;

const CategoryBadge = () => {};
