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
    `${TestEnvConfig.BASE_URL}/auth/login`,
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
    // Load test scenarios
    { duration: "10s", target: 10 }, // Ramp up to 10 users
    { duration: "20s", target: 10 }, // Stay at 10 users
    { duration: "10s", target: 50 }, // Ramp up to 50 users
    { duration: "20s", target: 50 }, // Stay at 50 users
    { duration: "10s", target: 100 }, // Ramp up to 100 users
    { duration: "20s", target: 100 }, // Stay at 100 users
    { duration: "20s", target: 0 }, // Ramp down to 0 users
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

  // VU performs complete CRUD cycle
  const vuId = `${__VU}-${Date.now()}-${Math.random()}`;

  // CREATE - Create a new product
  const productPayload = JSON.stringify({
    name: `Performance Test Product ${vuId}`,
    description: "Performance testing product",
    price: 99.99,
    quantity: 100,
    category: "Electronics",
  });

  const createResponse = http.post(
    `${TestEnvConfig.BASE_URL}/products`,
    productPayload,
    { headers }
  );

  check(createResponse, {
    "create product status is 200 or 201": (r) =>
      r.status === 200 || r.status === 201,
    "create product response time < 2s": (r) => r.timings.duration < 2000,
  });

  let productId: number | undefined;
  if (createResponse.status === 200 || createResponse.status === 201) {
    try {
      const responseBody = createResponse.json() as any;
      productId = responseBody.id;

      check(createResponse, {
        "created product has id": () =>
          productId !== undefined && productId > 0,
        "created product has name": () =>
          responseBody.name === `Performance Test Product ${vuId}`,
        "created product has correct price": () => responseBody.price === 99.99,
        "created product has correct quantity": () =>
          responseBody.quantity === 100,
      });
    } catch (e) {
      console.error(`Failed to parse create response: ${e}`);
    }
  }

  sleep(0.5);

  // READ - Get the created product
  if (productId) {
    const getResponse = http.get(
      `${TestEnvConfig.BASE_URL}/products/${productId}`,
      { headers }
    );

    check(getResponse, {
      "get product status is 200": (r) => r.status === 200,
      "get product response time < 2s": (r) => r.timings.duration < 2000,
    });

    if (getResponse.status === 200) {
      try {
        const getBody = getResponse.json() as any;
        check(getResponse, {
          "retrieved product has correct id": () => getBody.id === productId,
          "retrieved product has correct name": () =>
            getBody.name === `Performance Test Product ${vuId}`,
          "retrieved product has correct price": () => getBody.price === 99.99,
          "retrieved product has correct quantity": () =>
            getBody.quantity === 100,
          "retrieved product has correct category": () =>
            getBody.category === "Electronics",
        });
      } catch (e) {
        console.error(`Failed to parse get response: ${e}`);
      }
    }
  }

  sleep(0.5);

  // UPDATE - Update the product
  if (productId) {
    const updatePayload = JSON.stringify({
      name: `Updated Performance Product ${vuId}`,
      description: "Updated performance testing product",
      price: 149.99,
      quantity: 50,
      category: "Electronics",
    });

    const updateResponse = http.put(
      `${TestEnvConfig.BASE_URL}/products/${productId}`,
      updatePayload,
      { headers }
    );

    check(updateResponse, {
      "update product status is 200": (r) => r.status === 200,
      "update product response time < 2s": (r) => r.timings.duration < 2000,
    });

    if (updateResponse.status === 200) {
      try {
        const updateBody = updateResponse.json() as any;
        check(updateResponse, {
          "updated product has correct name": () =>
            updateBody.name === `Updated Performance Product ${vuId}`,
          "updated product has correct price": () =>
            updateBody.price === 149.99,
          "updated product has correct quantity": () =>
            updateBody.quantity === 50,
        });
      } catch (e) {
        console.error(`Failed to parse update response: ${e}`);
      }
    }
  }

  sleep(0.5);

  // LIST - Get all products
  const listResponse = http.get(`${TestEnvConfig.BASE_URL}/products`, {
    headers,
  });

  check(listResponse, {
    "list products status is 200": (r) => r.status === 200,
    "list products response time < 2s": (r) => r.timings.duration < 2000,
  });

  if (listResponse.status === 200) {
    try {
      const listBody = listResponse.json() as any;
      check(listResponse, {
        "list response has content array": () =>
          Array.isArray(listBody.content),
        "list response content is not empty": () =>
          listBody.content && listBody.content.length > 0,
      });
    } catch (e) {
      console.error(`Failed to parse list response: ${e}`);
    }
  }

  sleep(0.5);

  // DELETE - Delete the product
  if (productId) {
    const deleteResponse = http.del(
      `${TestEnvConfig.BASE_URL}/products/${productId}`,
      undefined,
      { headers }
    );

    check(deleteResponse, {
      "delete product status is 200 or 204": (r) =>
        r.status === 200 || r.status === 204,
      "delete product response time < 2s": (r) => r.timings.duration < 2000,
    });
  }

  sleep(1);
}

// Reporter hook
export function handleSummary(data: any) {
  return defaultHandleSummaryHook("product", data);
}
