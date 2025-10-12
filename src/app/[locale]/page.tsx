import { registerUserToDB } from "@/actions/user.action";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AuthButtons from "@/components/reuseable/buttons/AuthButtons";
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

    if (!user?.city) {
      redirect("/onboarding");
    }
  }
  return <div></div>;
}
