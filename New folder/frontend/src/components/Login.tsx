import React, { useState } from "react";
import { validateUsername, validatePassword } from "../utils/validation";
import { apiClient, type LoginRequest } from "../services/api";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate inputs
    const usernameValidation = validateUsername(formData.username);
    const passwordValidation = validatePassword(formData.password);

    if (!usernameValidation.isValid || !passwordValidation.isValid) {
      setErrors({
        username: usernameValidation.errors[0],
        password: passwordValidation.errors[0],
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.login(formData);
      localStorage.setItem("authToken", response.data.token);
      // Redirect or show success message
      window.location.href = "/dashboard";
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || "Login failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          data-testid="username-input"
        />
        {errors.username && (
          <span data-testid="username-error">{errors.username}</span>
        )}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          data-testid="password-input"
        />
        {errors.password && (
          <span data-testid="password-error">{errors.password}</span>
        )}
      </div>
      {errors.submit && <div data-testid="login-error">{errors.submit}</div>}
      <button type="submit" disabled={isSubmitting} data-testid="login-button">
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
