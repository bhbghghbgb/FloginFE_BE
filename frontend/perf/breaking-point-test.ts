import { check } from "k6";
import http from "k6/http";
import { TestEnvConfig } from "./config";

// Stress test to find breaking point
export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Normal load
    { duration: "2m", target: 200 }, // Medium load
    { duration: "2m", target: 500 }, // High load
    { duration: "2m", target: 1000 }, // Very high load
    { duration: "2m", target: 2000 }, // Extreme load
    { duration: "2m", target: 0 }, // Recovery
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
    "response time acceptable": (r) => r.timings.duration < 5000,
  });
}
