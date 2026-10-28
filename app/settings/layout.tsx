import SettingsShell from "@/components/settings/shell";

/**
 * The settings area, in the dashboard's chrome: a black sidebar and top bar
 * framing one white content panel, so moving between the two areas does not
 * change the room you are in. It replaces the marketing navbar (which hides
 * itself under /settings) and has no footer, since this is the app rather
 * than the site.
 */
export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return <SettingsShell>{children}</SettingsShell>;
}
