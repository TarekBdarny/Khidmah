import { pusherServer } from "@/lib/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, conversationData } = req.body;

  try {
    // Trigger the event to the user's private channel
    await pusherServer.trigger(
      `private-user-${userId}`,
      "new-conversation",
      conversationData
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Pusher error:", error);
    res.status(500).json({ error: "Failed to trigger event" });
  }
}
