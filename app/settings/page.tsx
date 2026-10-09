import { redirect } from "next/navigation";

/** /settings opens on the first page. */
export default function SettingsIndex() {
  redirect("/settings/profile");
}
