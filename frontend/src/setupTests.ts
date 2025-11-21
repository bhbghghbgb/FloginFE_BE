import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./mocks/server";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

const mockLocation = {
  // Methods to spy on
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  // Read-only properties (must be defined in the mock)
  href: "http://localhost/",
  pathname: "/",
  search: "",
  hash: "",
  origin: "http://localhost",
  // We add toString just in case
  toString: () => "http://localhost/",
};

// Use Object.defineProperty to override the read-only window.location property
Object.defineProperty(window, "location", {
  configurable: true,
  value: mockLocation,
});

// MSW setup
beforeAll(() => server.listen());
// Ensure window.location.assign is cleared between tests
afterEach(() => {
  server.resetHandlers();
  mockLocation.assign.mockClear();
});
afterAll(() => server.close());
