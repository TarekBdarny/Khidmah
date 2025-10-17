import { registerUserToDB } from "@/actions/user.action";
import AvailableCategories from "@/components/AvailableCategories";
import BecomeAWorker from "@/components/BecomeAWorker";
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
  const t = await getTranslations("HomePage");
  if (currUser) {
    await registerUserToDB();
  }
  const { userId } = await auth();

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) return;
    if (!user?.city) {
      redirect("/onboarding");
    }
  }
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhyToChooseUs />
      <FAQ02 />
      {/* <AvailableCategories /> */}
      {/* <Features01Page /> */}
      {/* <BecomeAWorker /> */}
      {/* <FooterSection /> */}
      <Footer05Page />
    </main>
  );
}
