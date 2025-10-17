import { getAuthUser } from "@/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

type AuthUserType = Awaited<ReturnType<typeof getAuthUser>>;
const useAuthUser = () => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchAuthUser = async () => {
      if (userId) {
        const authUser = await getAuthUser(userId);
        setAuthUser(authUser);
      }
    };

    fetchAuthUser();
  }, [userId]);

  return authUser;
};

export default useAuthUser;
