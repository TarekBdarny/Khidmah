import { useEffect, useRef, useCallback } from "react";

export function useOnlineStatus(userId: string | null | undefined) {
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const isSettingStatus = useRef(false);
  const lastStatus = useRef<boolean | null>(null);

  const setOnlineStatus = useCallback(
    async (isOnline: boolean) => {
      if (!userId || isSettingStatus.current) return;

      // Avoid redundant updates
      if (lastStatus.current === isOnline) return;

      try {
        isSettingStatus.current = true;
        lastStatus.current = isOnline;

        await fetch("/api/users/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            isOnline,
          }),
          // Add keepalive to ensure request completes even if page is closing
          keepalive: true,
        });
      } catch (error) {
        console.error("Error updating status:", error);
        // Reset lastStatus on error so we can retry
        lastStatus.current = null;
      } finally {
        isSettingStatus.current = false;
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) return;

    // Set user online when component mounts
    setOnlineStatus(true);

    // Send heartbeat every 25 seconds to keep status alive
    heartbeatInterval.current = setInterval(() => {
      if (!document.hidden) {
        setOnlineStatus(true);
      }
    }, 25000);

    // Handle page close/refresh
    const handleBeforeUnload = () => {
      // Use both sendBeacon and synchronous fetch as fallback
      const data = JSON.stringify({ userId, isOnline: false });

      // Try sendBeacon first (more reliable)
      const sent = navigator.sendBeacon("/api/users/status", data);

      // Fallback to synchronous fetch if sendBeacon fails
      if (!sent) {
        fetch("/api/users/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized window
        setOnlineStatus(false);
      } else {
        // User came back to the tab
        setOnlineStatus(true);
        // Restart heartbeat when returning
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        heartbeatInterval.current = setInterval(() => {
          if (!document.hidden) {
            setOnlineStatus(true);
          }
        }, 25000);
      }
    };

    // Handle when user goes offline/online (network status)
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    // Register all event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup function
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }

      // Set offline on cleanup
      setOnlineStatus(false);

      // Remove all event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [userId, setOnlineStatus]);

  return null;
}
