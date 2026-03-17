"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  // history="hash" is required for next-sanity@9 in the App Router:
  // without it, Studio tries to interpret the URL segment "studio" as a
  // tool name and shows "Tool not found: studio".
  return <NextStudio config={config} history="hash" />;
}
