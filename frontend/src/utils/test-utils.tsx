import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { AllProviders, AuthWrapper, RouterWrapper } from "./wrappers";

// Custom render function with all providers
const testWrapperRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

// Render with router only
export const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: RouterWrapper, ...options });

// Render with auth only
export const renderWithAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AuthWrapper, ...options });

// Re-export everything from testing-library
export * from "@testing-library/react";

// Export the main render function
export { testWrapperRender };

