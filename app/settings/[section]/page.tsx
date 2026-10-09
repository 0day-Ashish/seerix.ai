import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findItem, settingsSlugs } from "@/components/settings/nav";
import SettingsSection from "@/components/settings/sections";

/** Only the listed pages exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return settingsSlugs.map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: PageProps<"/settings/[section]">): Promise<Metadata> {
  const { section } = await params;
  return {
    title: `${findItem(section)?.label ?? "Settings"} · Settings · Seerix`,
  };
}

export default async function SettingsPage({
  params,
}: PageProps<"/settings/[section]">) {
  const { section } = await params;
  if (!settingsSlugs.includes(section)) notFound();
  return <SettingsSection slug={section} />;
}
