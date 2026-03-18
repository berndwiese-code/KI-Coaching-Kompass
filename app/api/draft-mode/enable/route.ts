import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

// Called by the Sanity Studio Presentation tool to enable Next.js Draft Mode
// Requires SANITY_API_READ_TOKEN to be set (generate at sanity.io/manage → API → Tokens)
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
});
