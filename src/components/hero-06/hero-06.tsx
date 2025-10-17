import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CirclePlay,
  Hammer,
  HardHat,
  UserPlus,
  Users,
} from "lucide-react";
import { BackgroundPattern } from "./background-pattern";
import Link from "next/link";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const t = useTranslations("HeroSection");
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <BackgroundPattern />

      <div className="relative z-10 text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link href="#">
            {t("badge")}
            <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          {t("header")}
        </h1>
        <p className="mt-6 md:text-lg">{t("subheader")}</p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href={"#"}>
            <Button
              size="lg"
              variant={"action"}
              className="rounded-full text-base"
            >
              {t("getStarted")} <ArrowUpRight className="h-5! w-5!" />
            </Button>
          </Link>
          <Link href={"/becomeWorker"}>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <Hammer className="h-5! w-5!" /> {t("joinOurWorkers")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
