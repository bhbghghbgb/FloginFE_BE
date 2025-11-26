import { check } from "k6";
import http from "k6/http";
import { defaultHandleSummaryHook, TestEnvConfig } from "./k6.config.ts";

// Stress test to find breaking point
export const options = {
  stages: [
    { duration: "10s", target: 20 }, // Normal load
    { duration: "10s", target: 50 }, // Medium load
    { duration: "10s", target: 75 }, // High load
    { duration: "10s", target: 100 }, // Very high load
    { duration: "10s", target: 150 }, // Extreme load
    { duration: "10s", target: 0 }, // Recovery
  ],
};

export default function () {
  const payload = JSON.stringify({
    username: TestEnvConfig.USERNAME,
    password: TestEnvConfig.PASSWORD,
  });

  const response = http.post(`${TestEnvConfig.BASE_URL}/auth/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(response, {
    "login successful": (r) => r.status === 200,
    "response time acceptable": (r) => r.timings.duration < 2000,
  });
}

// Reporter hook
export function handleSummary(data: any) {
  return defaultHandleSummaryHook("breaking-point", data);
}
