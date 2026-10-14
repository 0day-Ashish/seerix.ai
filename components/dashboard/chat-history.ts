"use client";

import { useEffect, useState } from "react";

import { cannedAnswer, type Message } from "@/components/dashboard/data";

/* -------------------------------------------------------------------------
 * Chat history, shared by the chat page and the sidebar. Until threads are
 * stored by the backend they live in this browser; a first visit is seeded
 * with a few earlier conversations so the list isn't empty.
 * ---------------------------------------------------------------------- */

export type Thread = {
  id: string;
  title: string;
  at: number;
  messages: Message[];
};

const KEY = "seerix-chats";
const EVENT = "seerix-chats";
const DAY = 86_400_000;

function seed(): Thread[] {
  const now = Date.now();
  return [
    ["Which pages are close to page one?", 1],
    ["Did the /pricing title fix work?", 3],
    ["Who should I get links from?", 6],
    ["Which of my keywords moved the most?", 9],
  ].map(([q, ago], i) => ({
    id: `seed-${i}`,
    title: q as string,
    at: now - (ago as number) * DAY,
    messages: [
      { role: "user", text: q as string },
      { role: "ai", answer: cannedAnswer(q as string) },
    ],
  }));
}

let cache: Thread[] | null = null;
let active: string | null = null;

export function loadThreads(): Thread[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Thread[]) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}

function commit(next: Thread[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function saveThread(t: Thread) {
  const rest = loadThreads().filter((x) => x.id !== t.id);
  commit([t, ...rest]);
}

export function deleteThread(id: string) {
  commit(loadThreads().filter((x) => x.id !== id));
}

export function getThread(id: string) {
  return loadThreads().find((t) => t.id === id) ?? null;
}

/** Which thread the chat page has open, for the sidebar's highlight. */
export function setActiveThread(id: string | null) {
  active = id;
  window.dispatchEvent(new Event(EVENT));
}

export const newThreadId = () =>
  `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** The list, newest first, and the open thread; both stay in sync. */
export function useThreads() {
  const [state, setState] = useState<{
    threads: Thread[];
    active: string | null;
  }>({ threads: [], active: null });
  useEffect(() => {
    const read = () =>
      setState({
        threads: [...loadThreads()].sort((a, b) => b.at - a.at),
        active,
      });
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);
  return state;
}

/** "Today", "Yesterday", a weekday this week, else a date. */
export function when(at: number) {
  const days = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date(at).setHours(0, 0, 0, 0)) / DAY,
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)
    return new Date(at).toLocaleDateString("en-US", { weekday: "long" });
  return new Date(at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
