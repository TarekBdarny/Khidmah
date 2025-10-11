"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { LanguagesIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const handleSwitch = (newLocale: "ar" | "he") => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");
    router.push(newPathname);
  };
  const t = useTranslations("LocaleSwitcher");
  return (
    <Button
      variant={"outline"}
      onClick={() => handleSwitch(locale === "ar" ? "he" : "ar")}
    >
      <LanguagesIcon />

      {<p>{t("label")}</p>}
    </Button>
  );
};

export default LocaleSwitcher;
