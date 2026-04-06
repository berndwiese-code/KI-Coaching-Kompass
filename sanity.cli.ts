import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "w8oq2446",
    dataset: "production",
  },
  vite: (config) => ({
    ...config,
    optimizeDeps: {
      ...config.optimizeDeps,
      exclude: [
        ...((config.optimizeDeps?.exclude) ?? []),
        "@tanstack/react-table",
      ],
    },
  }),
});
