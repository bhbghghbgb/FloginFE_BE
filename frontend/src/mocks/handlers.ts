import { http, HttpResponse } from "msw";

export const handlers = [
  // --- AUTHENTICATION HANDLERS ---
  http.post("/api/auth/login", async ({ request }) => {
    // Access request body asynchronously using request.json() in MSW 2.x
    const { username, password } = (await request.json()) as any;

    if (username === "validuser" && password === "validpass123") {
      // Successful login (HTTP 200)
      return HttpResponse.json({
        success: true,
        message: "Login successful",
        token: "jwt-token",
      });
    } else {
      // Failed login (HTTP 401 Unauthorized)
      return HttpResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      ); // Set the status code via the options object
    }
  }),

  // --- PRODUCT LIST HANDLER (GET /api/products) ---
  http.get("/api/products", () => {
    // Mocked list response
    return HttpResponse.json({
      content: [
        {
          id: 1,
          name: "Test Product",
          price: 100,
          quantity: 10,
          description: "Test Description",
          category: "Electronics",
          active: true,
        },
      ],
    });
  }),

  // --- GET PRODUCT BY ID HANDLER (GET /api/products/:id) ---
  http.get("/api/products/:id", ({ params }) => {
    const { id } = params;
    // Mocked single product response
    return HttpResponse.json({
      id: Number(id),
      name: "Test Product",
      price: 100,
      quantity: 10,
      description: "Test Description",
      category: "Electronics",
      active: true,
    });
  }),

  // --- CREATE PRODUCT HANDLER (POST /api/products) ---
  http.post("/api/products", async ({ request }) => {
    const product = (await request.json()) as any;
    // Mocked creation response with a new ID
    return HttpResponse.json({
      id: 1, // Mocked ID
      ...product,
    });
  }),

  // --- UPDATE PRODUCT HANDLER (PUT /api/products/:id) ---
  http.put("/api/products/:id", async ({ params, request }) => {
    const { id } = params;
    const product = (await request.json()) as any;
    // Mocked update response
    return HttpResponse.json({
      id: Number(id),
      ...product,
    });
  }),

  // --- DELETE PRODUCT HANDLER (DELETE /api/products/:id) ---
  http.delete("/api/products/:id", () => {
    // HTTP 204 No Content response
    return new HttpResponse(null, { status: 204 });
  }),
];
