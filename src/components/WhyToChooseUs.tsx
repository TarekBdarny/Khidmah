import React from "react";
import GridContainer from "./reuseable/GridContainer";
import HomepageCard from "./Cards/HomepageCard";
import { useTranslations } from "next-intl";
import { Timer, Zap, ZoomIn } from "lucide-react";

const WhyToChooseUs = () => {
  return (
    // <section className="py-20 px-12">
    //   <h2 className="text-center text-2xl mb-10">{t("title")}</h2>
    //   <GridContainer>
    //     {items.map((item, index) => (
    //       <HomepageCard key={index} category={item} />
    //     ))}
    //   </GridContainer>
    // </section>
    // <Feature16 />
    <>
      <Features />
    </>
  );
};

export default WhyToChooseUs;

const Feature16 = () => {
  const t = useTranslations("WhyToChooseUs");

  const items = [
    {
      engName: "trustworthy workers",
      usedName: t("trustworthyWorkers"),
      icon: <Timer />,
      description: t("trustworthyWorkersDesc"),
    },
    {
      engName: "honest reviews",
      usedName: t("honestReviews"),
      icon: <Zap />,
      description: t("honestReviewsDesc"),
    },
    {
      engName: "secure payment",
      usedName: t("securePayment"),
      icon: <ZoomIn />,
      description: t("securePaymentDesc"),
    },
    {
      engName: "easy reservation",
      usedName: t("easyReservation"),
      icon: <ZoomIn />,
      description: t("easyReservationDesc"),
    },
    {
      engName: "quality service",
      usedName: t("qualityService"),
      icon: <ZoomIn />,
      description: t("qualityServiceDesc"),
    },
    {
      engName: "quality assurance",
      usedName: t("qualityAssurance"),
      icon: <ZoomIn />,
      description: t("qualityAssuranceDesc"),
    },
  ];
  return (
    <section className="py-32 flex items-center justify-center">
      <div className="container">
        <p className="text-muted-foreground mb-4 text-sm lg:text-base">
          OUR VALUES
        </p>
        <h2 className="text-3xl font-medium lg:text-4xl">{t("title")}</h2>
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          {items.map((item, index) => (
            <FeatureCard
              key={index}
              icon={item.icon}
              title={item.usedName}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-accent rounded-lg p-5">
      <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
        {icon}
      </span>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground leading-7">{description}</p>
    </div>
  );
};
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles } from "lucide-react";
import { ReactNode } from "react";

export function Features() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Built to cover your needs
          </h2>
          <p className="mt-4">
            Libero sapiente aliquam quibusdam aspernatur, praesentium iusto
            repellendus.
          </p>
        </div>
        <div className="@min-lg:grid-cols-2 @ming-lg:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid  gap-6 *:text-center md:mt-16">
          {/* className="mx-auto mt-8 grid max-w-6xl gap-6 *:text-center sm:grid-cols-2 lg:grid-cols-4 md:mt-16" */}
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Customizable</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Extensive customization options, allowing you to tailor every
                aspect to meet your specific needs.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2 className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">You have full control</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                From design elements to functionality, you have complete control
                to create a unique and personalized experience.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Powered By AI</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Elements to functionality, you have complete control to create a
                unique experience.
              </p>
            </CardContent>
          </Card>
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Powered By AI</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Elements to functionality, you have complete control to create a
                unique experience.
              </p>
            </CardContent>
          </Card>
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Powered By AI</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Elements to functionality, you have complete control to create a
                unique experience.
              </p>
            </CardContent>
          </Card>
          <Card className="group shadow-zinc-950/5 bg-background">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Powered By AI</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Elements to functionality, you have complete control to create a
                unique experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
