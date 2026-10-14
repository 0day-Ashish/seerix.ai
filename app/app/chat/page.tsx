import type { Metadata } from "next";

import Chat from "@/components/dashboard/chat";

export const metadata: Metadata = { title: "Chat · Seerix" };

/**
 * `?q=` carries a question handed over from an alert or another tab;
 * `?t=` reopens an earlier conversation from the sidebar.
 */
export default async function ChatPage({
  searchParams,
}: PageProps<"/app/chat">) {
  const { q, t } = await searchParams;
  const thread = typeof t === "string" ? t : undefined;
  // Keyed by thread, so picking another chat in the sidebar starts fresh.
  return (
    <Chat
      key={thread ?? "new"}
      ask={typeof q === "string" ? q : undefined}
      thread={thread}
    />
  );
}
