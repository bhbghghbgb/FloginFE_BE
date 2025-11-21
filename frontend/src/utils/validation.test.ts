import { describe, expect, it } from "vitest";
import {
  validatePassword,
  validateProduct,
  validateUsername,
} from "./validation";

describe("Login Validation", () => {
  describe("validateUsername", () => {
    it("should return error for empty username", () => {
      const result = validateUsername("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username is required");
    });

    it("should return error for username too short", () => {
      const result = validateUsername("ab");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username must be at least 3 characters");
    });

    it("should return error for username too long", () => {
      const result = validateUsername("a".repeat(21));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Username must be less than 20 characters"
      );
    });

    it("should return error for username with special characters", () => {
      const result = validateUsername("user@name");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Username can only contain letters, numbers, and underscores"
      );
    });

    it("should return valid for correct username", () => {
      const result = validateUsername("valid_user123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("validatePassword", () => {
    it("should return error for empty password", () => {
      const result = validatePassword("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
    });

    it("should return error for password too short", () => {
      const result = validatePassword("abc12");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be at least 6 characters");
    });

    it("should return error for password without letters", () => {
      const result = validatePassword("123456");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one letter"
      );
    });

    it("should return error for password without numbers", () => {
      const result = validatePassword("abcdef");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
    });

    it("should return valid for correct password", () => {
      const result = validatePassword("valid123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe("Product Validation", () => {
  describe("validateProduct", () => {
    it("should validate product name", () => {
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

    it("should validate price boundaries", () => {
      const zeroPrice = validateProduct({
        name: "Test Product",
        price: 0,
        quantity: 10,
        description: "Test",
        category: "Electronics",
      });
      expect(zeroPrice.isValid).toBe(false);
      expect(zeroPrice.errors).toContain("Price must be greater than 0");

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

    it("should validate quantity boundaries", () => {
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

    it("should validate description length", () => {
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

    it("should validate category", () => {
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
