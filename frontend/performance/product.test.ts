import { check, sleep } from "k6";
import http from "k6/http";
import { TestEnvConfig, defaultHandleSummaryHook } from "./k6.config.ts";

// Get auth token for product tests
function getAuthToken(): string {
  const loginPayload = JSON.stringify({
    username: TestEnvConfig.USERNAME,
    password: TestEnvConfig.PASSWORD,
  });

  const loginResponse = http.post(
    `${TestEnvConfig.BASE_URL}/api/auth/login`,
    loginPayload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (loginResponse.status === 200) {
    return loginResponse.json("token") as string;
  }
  return "";
}

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 200 },
    { duration: "2m", target: 200 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const token = getAuthToken();
  if (!token) {
    console.error("Failed to get auth token");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Test GET products
  const getProductsResponse = http.get(`${TestEnvConfig.BASE_URL}/products`, {
    headers,
  });

  check(getProductsResponse, {
    "get products status is 200": (r) => r.status === 200,
    "get products response time < 1s": (r) => r.timings.duration < 1000,
  });

  // // Test POST product
  // const productPayload = JSON.stringify({
  //   name: `Test Product ${Math.random()}`,
  //   description: "Performance test product",
  //   price: 99.99,
  // });

  // const createProductResponse = http.post(
  //   `${TestEnvConfig.BASE_URL}/products`,
  //   productPayload,
  //   { headers }
  // );

  // check(createProductResponse, {
  //   "create product status is 200": (r) => r.status === 200,
  //   "create product response time < 1s": (r) => r.timings.duration < 1000,
  // });

  sleep(1);
}

// Reporter hook
export function handleSummary(data: any) {
  return defaultHandleSummaryHook("k6-report/product.html", data);
}
