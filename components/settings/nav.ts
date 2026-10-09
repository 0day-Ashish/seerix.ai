/**
 * The settings sidebar, in order. Every page under /settings is listed here
 * once; the layout draws the nav from it and the route pre-renders one page
 * per slug, so adding a page means adding it here and to `sections.tsx`.
 */

export type SettingsItem = { slug: string; label: string; icon: string };
export type SettingsGroup = { label: string; items: SettingsItem[] };

/** 16px stroke icons, one path each. */
export const settingsGroups: SettingsGroup[] = [
  {
    label: "Personal",
    items: [
      {
        slug: "profile",
        label: "Profile",
        icon: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 14c.6-2.8 2.8-4.2 5.5-4.2s4.9 1.4 5.5 4.2",
      },
      {
        slug: "notifications",
        label: "Notifications",
        icon: "M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3L4 11zM6.5 13.5h3",
      },
      {
        slug: "affiliate",
        label: "Affiliate",
        icon: "M2.5 6.5h11v2h-11zM3.5 8.5h9v5h-9zM8 6.5v7M8 6.5C6.5 6.5 5 5.8 5 4.5S6.5 2.8 8 6.5c1.5-3.7 3-3.3 3-2s-1.5 2-3 2",
      },
      {
        slug: "learn",
        label: "Learn",
        icon: "M8 3L1.5 6 8 9l6.5-3L8 3zM4 7.3V11c1.2 1.2 2.6 1.8 4 1.8s2.8-.6 4-1.8V7.3M13.5 6.5V10",
      },
    ],
  },
  {
    label: "Project",
    items: [
      {
        slug: "knowledge",
        label: "Knowledge",
        icon: "M2 3.5h4.5A1.5 1.5 0 0 1 8 5v8.5a1.5 1.5 0 0 0-1.5-1.5H2zM14 3.5H9.5A1.5 1.5 0 0 0 8 5v8.5a1.5 1.5 0 0 1 1.5-1.5H14z",
      },
      {
        slug: "integrations",
        label: "Integrations",
        icon: "M8 5c3 0 5-.9 5-2s-2-2-5-2-5 .9-5 2 2 2 5 2zM3 3v10c0 1.1 2 2 5 2s5-.9 5-2V3M3 8c0 1.1 2 2 5 2s5-.9 5-2",
      },
      {
        slug: "exclusion-lists",
        label: "Exclusion lists",
        icon: "M8 2.5l5 2v3.5c0 3-2.2 5-5 6-2.8-1-5-3-5-6V4.5l5-2zM4.5 4.5l7 7",
      },
      {
        slug: "scheduled",
        label: "Scheduled",
        icon: "M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 5v3l2 1.5",
      },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        slug: "team",
        label: "Team",
        icon: "M6 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1.5 13.5c.5-2.4 2.3-3.6 4.5-3.6s4 1.2 4.5 3.6M10.5 2.7a2.5 2.5 0 0 1 0 4.6M12 9.9c1.3.5 2.2 1.7 2.5 3.6",
      },
      {
        slug: "projects",
        label: "Projects",
        icon: "M5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM11 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM1.5 12c.4-2 1.7-3 3.5-3s3.1 1 3.5 3M7.5 12c.4-2 1.7-3 3.5-3s3.1 1 3.5 3",
      },
      {
        slug: "domains",
        label: "Domains",
        icon: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM2 8h12M8 2c1.7 1.8 2.5 3.8 2.5 6S9.7 12.2 8 14C6.3 12.2 5.5 10.2 5.5 8S6.3 3.8 8 2z",
      },
      {
        slug: "developers",
        label: "Developers",
        icon: "M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5M9 3L7 13",
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        slug: "billing",
        label: "Billing",
        icon: "M2 4h12v8H2zM2 6.5h12M4.5 9.5h3",
      },
      {
        slug: "invoices",
        label: "Invoices",
        icon: "M4 2h8v12l-2-1.2L8 14l-2-1.2L4 14zM6 5.5h4M6 8h4",
      },
      {
        slug: "usage",
        label: "Usage",
        icon: "M3 13.5V9M6.5 13.5V6.5M10 13.5V4M13.5 13.5V8",
      },
    ],
  },
];

export const settingsSlugs = settingsGroups.flatMap((g) =>
  g.items.map((i) => i.slug),
);

export function findItem(slug: string) {
  return settingsGroups.flatMap((g) => g.items).find((i) => i.slug === slug);
}
