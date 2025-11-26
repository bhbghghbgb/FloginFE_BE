declare var __ENV: {
  [key: string]: string | undefined;
};

export const TestEnvConfig = {
  BASE_URL: __ENV.BASE_URL || "http://localhost:8080/api",
  USERNAME: __ENV.USERNAME || "testuser",
  PASSWORD: __ENV.PASSWORD || "Test123",
};

// @ts-expect-error
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/3.0.3/dist/bundle.js";
// @ts-expect-error
import { textSummary } from "https://jslib.k6.io/k6-summary/0.1.0/index.js";

export function defaultHandleSummaryHook(file: string, data: any) {
  return {
    [`k6-report/${file}.html`]: htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
