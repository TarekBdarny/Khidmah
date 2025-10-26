import { useEffect, useState } from "react";

export function useUserOnlineStatus(userId: string | undefined) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStatus = async () => {
      // Only fetch if tab is visible
      if (document.hidden) return;

      try {
        const response = await fetch(`/api/users/${userId}/status`);
        if (response.ok) {
          const data = await response.json();
          setIsOnline(data.isOnline);
          setLastSeen(data.lastSeen ? new Date(data.lastSeen) : null);
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);

    // Refetch when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId]);

  return { isOnline, lastSeen };
}
