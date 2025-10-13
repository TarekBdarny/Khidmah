import { useTranslations } from "next-intl";
import React from "react";
import GridContainer from "./reuseable/GridContainer";
import HomepageCard from "./Cards/HomepageCard";

const AvailableCategories = () => {
  const t = useTranslations("AvailableCategories");
  const categories = [
    {
      engName: "electricity",
      usedName: t("electricity"),
      icon: "⚡",
      description: t("electricityDesc"),
    },
    {
      engName: "painting",
      usedName: t("painting"),
      icon: "🎨",
      description: t("paintingDesc"),
    },
    {
      engName: "cleaning",
      usedName: t("cleaning"),
      icon: "🧼",
      description: t("cleaningDesc"),
    },
    {
      engName: "plumbing",
      usedName: t("plumbing"),
      icon: "🪑",
      description: t("plumbingDesc"),
    },
    {
      engName: "carpentry",
      usedName: t("carpentry"),
      icon: "🪜",
      description: t("carpentryDesc"),
    },
    {
      engName: "building",
      usedName: t("building"),
      icon: "🏗️",
      description: t("buildingDesc"),
    },
  ];
  return (
    <section className="py-20 px-12">
      <h2 className="text-center text-2xl mb-10">{t("title")}</h2>
      <GridContainer>
        {categories.map((category, index) => (
          <HomepageCard key={index} category={category} />
        ))}
      </GridContainer>
    </section>
  );
};

export default AvailableCategories;
