"use client";
import { getLoggedUserId } from "@/actions/user.action";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";

export function OnlineStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null | undefined>(null);
  useEffect(() => {
    const getUserId = async () => {
      const id = await getLoggedUserId();
      setUserId(id);
    };
    getUserId();
  }, []);

  useOnlineStatus(userId);

  return <>{children}</>;
}
