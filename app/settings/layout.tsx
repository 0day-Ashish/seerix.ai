import SettingsSidebar from "@/components/settings/sidebar";

/**
 * The settings shell: the sidebar beside the page. It replaces the marketing
 * navbar (which hides itself under /settings) and has no footer, since this is
 * the app rather than the site.
 */
export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <div data-app className="min-h-dvh bg-[#f5f5f6] lg:flex">
      <SettingsSidebar />
      {/* The page is one white panel on the grey, as in the dashboard. */}
      <div className="min-w-0 flex-1 lg:py-2 lg:pr-2">
        <main className="min-h-[calc(100dvh-140px)] rounded-t-[22px] border-t border-zinc-200/80 bg-white px-5 pb-20 pt-7 sm:px-8 lg:min-h-[calc(100dvh-16px)] lg:rounded-[20px] lg:border lg:border-zinc-200/80 lg:px-12 lg:pt-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
