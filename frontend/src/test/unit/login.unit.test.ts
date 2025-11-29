import { describe, expect, it } from "vitest";
import {
  validatePassword,
  validateUsername,
} from "../../utils/validation";

describe("Login Validation", () => {
  describe("validateUsername", () => {
    it("should return error for empty username", () => {
      const result = validateUsername("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username is required");
    });

    it("should return error for null username", () => {
      const result = validateUsername(null as unknown as string);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username is required");
    });

    it("should return error for username too short", () => {
      const result = validateUsername("ab");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username must be at least 3 characters");
    });

    it("should return error for username too long", () => {
      const result = validateUsername("a".repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Username must be less than 50 characters"
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

    it("should return error for null password", () => {
      const result = validatePassword(null as unknown as string);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
    });

    it("should return error for password too short", () => {
      const result = validatePassword("abc12");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be at least 6 characters");
    });

    it("should return error for password too long", () => {
      const result = validatePassword("abc12".repeat(50));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be less than 100 characters");
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