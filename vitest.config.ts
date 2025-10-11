import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        coverage: {
            reporter: ["text", "html"],
        },
        ui: false,
        include: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    },
});
