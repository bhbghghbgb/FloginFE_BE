import { check, sleep } from "k6";
import http from "k6/http";
import { TestEnvConfig, defaultHandleSummaryHook } from "./k6.config";

export const options = {
  stages: [
    // Load test scenarios
    { duration: "30s", target: 100 }, // Ramp up to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 500 }, // Ramp up to 500 users
    { duration: "1m", target: 500 }, // Stay at 500 users
    { duration: "30s", target: 1000 }, // Ramp up to 1000 users
    { duration: "2m", target: 1000 }, // Stay at 1000 users
    { duration: "30s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests should be below 2s
    http_req_failed: ["rate<0.01"], // Less than 1% failed requests
  },
};

export default function () {
  const payload = JSON.stringify({
    username: TestEnvConfig.USERNAME,
    password: TestEnvConfig.PASSWORD,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(
    `${TestEnvConfig.BASE_URL}/auth/login`,
    payload,
    params
  );

  check(response, {
    "login status is 200": (r) => r.status === 200,
    "login response has token": (r) => r.json("token") !== undefined,
    "login response time < 2s": (r) => r.timings.duration < 2000,
  });

  sleep(1);
}

// Stress test configuration
export function setup() {
  console.log("Starting login performance tests");
}

export function teardown(data: any) {
  console.log("Login performance tests completed");
}

// Reporter hook
export function handleSummary(data: any) {
  return defaultHandleSummaryHook("k6-report/login.html", data);
}
