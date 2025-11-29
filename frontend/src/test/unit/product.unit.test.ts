import { describe, expect, it } from "vitest";
import {
  validateProduct,
} from "../../utils/validation";

describe("Product Validation", () => {
  describe("validateProduct", () => {
    it("should return error for empty product name", () => {
      const result = validateProduct({
        name: "",
        price: 100,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Product name is required");
    });

    it("should return error for null product name", () => {
      const result = validateProduct({
        name: null as unknown as string,
        price: 100,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Product name is required");
    });

    it("should return error for product name too short", () => {
      const result = validateProduct({
        name: "a",
        price: 100,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Product name must be at least 3 characters");
    });

    it("should return error for product name too long", () => {
      const result = validateProduct({
        name: "a".repeat(101),
        price: 100,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Product name must be less than 100 characters");
    });

    it("should return error for price is NaN", () => {
      const zeroPrice = validateProduct({
        name: "Test Product",
        price: "a",
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(zeroPrice.isValid).toBe(false);
      expect(zeroPrice.errors).toContain("Price must be a valid number");
    });

    it("should return error for price less than 1", () => {
      const zeroPrice = validateProduct({
        name: "Test Product",
        price: 0,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(zeroPrice.isValid).toBe(false);
      expect(zeroPrice.errors).toContain("Price must be greater than 0");
    });

    it("should return error for price greater than 999,999,999", () => {
      const hugePrice = validateProduct({
        name: "Test Product",
        price: 1000000000,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(hugePrice.isValid).toBe(false);
      expect(hugePrice.errors).toContain("Price must be less than 999,999,999");
    });

    it("should return error for quantity is NaN", () => {
      const negativeQuantity = validateProduct({
        name: "Test Product",
        price: 100,
        quantity: "a",
        description: "Test",
        category: "Electronics",
      });
      expect(negativeQuantity.isValid).toBe(false);
      expect(negativeQuantity.errors).toContain(
        "Quantity must be a valid number"
      );
    });

    it("should return error for quantity less than 0", () => {
      const negativeQuantity = validateProduct({
        name: "Test Product",
        price: 100,
        quantity: -1,
        description: "Test",
        category: "Electronics",
      });
      expect(negativeQuantity.isValid).toBe(false);
      expect(negativeQuantity.errors).toContain(
        "Quantity must be 0 or greater"
      );
    });

    it("should return error for quantiry greater than 99999", () => {
      const negativeQuantity = validateProduct({
        name: "Test Product",
        price: 100,
        quantity: 100000,
        description: "Test",
        category: "Electronics",
      });
      expect(negativeQuantity.isValid).toBe(false);
      expect(negativeQuantity.errors).toContain(
        "Quantity must be less than 99,999"
      );
    });

    it("should return error for validate description length", () => {
      const longDescription = validateProduct({
        name: "Test Product",
        price: 100,
        quantity: 10,
        description: "a".repeat(501),
        category: "Electronics",
      });
      expect(longDescription.isValid).toBe(false);
      expect(longDescription.errors).toContain(
        "Description must be less than 500 characters"
      );
    });

    it("should return error for validate category", () => {
      const result = validateProduct({
        name: "Test Product",
        price: 100,
        quantity: 10,
        description: "Test",
        category: "",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Category is required");
    });

    it("should return valid for correct product data", () => {
      const result = validateProduct({
        name: "Test Product",
        price: 100,
        quantity: 10,
        description: "Valid description",
        category: "Electronics",
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
