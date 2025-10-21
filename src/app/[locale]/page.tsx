import { registerUserToDB } from "@/actions/user.action";
import AvailableCategories from "@/components/AvailableCategories";
import BecomeAWorker from "@/components/BecomeAWorker";
import { CallToAction } from "@/components/CallToAction";
import FAQ02 from "@/components/faq-02/faq-02";
import Features01Page from "@/components/features-01/features-01";
import FooterSection from "@/components/footer";
import Footer05Page from "@/components/footer-05/footer-05";
import HeroSection from "@/components/hero-06/hero-06";
// import HeroSection from "@/components/HeroSection";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AuthButtons from "@/components/reuseable/buttons/AuthButtons";
import WhyToChooseUs from "@/components/WhyToChooseUs";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const currUser = await currentUser();
  const t = await getTranslations("CTA");
  const items = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
  ];
  if (currUser) {
    await registerUserToDB();
  }
  // const { userId } = await auth();

  // if (userId) {
  //   const user = await prisma.user.findUnique({
  //     where: { clerkId: userId },
  //   });
  //   if (!user) return;
  //   if (!user?.verified) {
  //     redirect("/onboarding");
  //   }
  // }
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhyToChooseUs />
      <FAQ02 />
      <CallToAction
        title={t("title")}
        description={t("subtitle")}
        buttonText={t("button")}
        buttonUrl="/becomeWorker"
        items={items}
      />
      <Footer05Page />
    </main>
  );
}
