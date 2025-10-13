import React from "react";
import GridContainer from "./reuseable/GridContainer";
import HomepageCard from "./Cards/HomepageCard";
import { useTranslations } from "next-intl";

const WhyToChooseUs = () => {
  const t = useTranslations("WhyToChooseUs");
  const items = [
    {
      engName: "trustworthy workers",
      usedName: t("trustworthyWorkers"),
      icon: "✅",
      description: t("trustworthyWorkersDesc"),
    },
    {
      engName: "honest reviews",
      usedName: t("honestReviews"),
      icon: "⭐",
      description: t("honestReviewsDesc"),
    },
    {
      engName: "secure payment",
      usedName: t("securePayment"),
      icon: "💰",
      description: t("securePaymentDesc"),
    },
    {
      engName: "easy reservation",
      usedName: t("easyReservation"),
      icon: "📱",
      description: t("easyReservationDesc"),
    },
    {
      engName: "quality service",
      usedName: t("qualityService"),
      icon: "⏰",
      description: t("qualityServiceDesc"),
    },
    {
      engName: "quality assurance",
      usedName: t("qualityAssurance"),
      icon: "🛡️",
      description: t("qualityAssuranceDesc"),
    },
  ];

  return (
    <section className="py-20 px-12">
      <h2 className="text-center text-2xl mb-10">{t("title")}</h2>
      <GridContainer>
        {items.map((item, index) => (
          <HomepageCard key={index} category={item} />
        ))}
      </GridContainer>
    </section>
  );
};

export default WhyToChooseUs;
