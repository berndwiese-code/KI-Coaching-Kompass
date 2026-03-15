// Fallback redirect: the middleware handles / → /de in normal operation.
// This page-level redirect is a safety net in case the middleware does not run
// (e.g. during static generation or when the matcher doesn't fire).
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/de");
}
