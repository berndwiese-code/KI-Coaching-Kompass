import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { structure } from "./sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title: "KI Coaching Kompass",
  projectId: "w8oq2446",
  dataset: "production",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
