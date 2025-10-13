import React from "react";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const t = useTranslations("HeroSection");
  return (
    <section className="py-20 px-12 text-center ">
      <h1 className="heroTitle">{t("HeroHeader")}</h1>
      <p className="text-xl mb-12 ">{t("HeroSubheader")}</p>
      {/* search-container */}
      <div className="max-w-[900px] mt-0 mx-auto">
        {/* search-box */}
        <div className="p-4 rounded-[12px] flex flex-col md:flex-row gap-4 border-1 shadow-md ">
          <ButtonGroupInput />
          <Button
            variant={"action"}
            className="p-4 border-0 rounded-md text-lg hover:-translate-y-0.5"
          >
            {t("searchButton")}
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-[0.9rem]">{t("popularSearch")}</span>
          <SearchTags />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

function ButtonGroupInput() {
  const t = useTranslations("HeroSection");
  return (
    <div className="flex-1 relative bg-background">
      <Button variant={"ghost"} className="absolute top-1/2 -translate-y-1/2 ">
        <SearchIcon className="w-5 h-5" />
      </Button>
      <Input
        type="text"
        placeholder={t("searchPlaceholder")}
        className="pr-12 py-2 border-none outline-none focus:ring-1 focus:ring-primary "
      />
    </div>
  );
}
function SearchTags() {
  const t = useTranslations("HeroSection");
  const workersArray = [
    "electrician",
    "plumber",
    "carpenter",
    "painter",
    "cleaner",
  ];
  return workersArray.map((worker) => (
    <span
      key={worker}
      className="cursor-pointer dark:bg-input/30 w-[70px] rounded-2xl border-1 transition-all px-2 py-4 text-sm"
    >
      {t(worker)}
    </span>
  ));
}
