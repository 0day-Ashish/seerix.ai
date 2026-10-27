import SettingsHeader from "@/components/settings/header";
import SettingsSidebar from "@/components/settings/sidebar";

/**
 * The settings shell, in the dashboard's chrome: a black sidebar and top bar
 * framing one white content panel, so moving between the two areas does not
 * change the room you are in. It replaces the marketing navbar (which hides
 * itself under /settings) and has no footer, since this is the app rather
 * than the site.
 */
export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <div data-app className="flex min-h-dvh flex-col bg-signal-ink lg:flex-row">
      <SettingsSidebar />
      <div className="min-w-0 flex-1 bg-signal-ink">
        <SettingsHeader />
        <main className="min-h-[calc(100dvh-57px)] bg-white px-5 pb-20 pt-7 sm:px-8 lg:px-12 lg:pt-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
