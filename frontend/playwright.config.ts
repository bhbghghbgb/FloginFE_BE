import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["html"],
    ["list"], // optional: also show results in console
    ...(process.env.CI ? [["github"] as const] : []),
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on", // capture trace for every test
    screenshot: "on", // capture screenshot for every test
    video: "on", // record video for every test
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
  webServer: {
    command: "yarn build && yarn preview",
    url: "http://localhost:3000",
    // reuseExistingServer: !process.env.CI,
    reuseExistingServer: true,
  },
});
