import SettingsSidebar from "@/components/settings/sidebar";

/**
 * The settings shell: the sidebar beside the page. It replaces the marketing
 * navbar (which hides itself under /settings) and has no footer, since this is
 * the app rather than the site.
 */
export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#fbfaf9] lg:flex-row">
      <SettingsSidebar />
      <main className="min-w-0 flex-1 px-5 pb-20 pt-8 sm:px-10 lg:px-16 lg:pt-14">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
