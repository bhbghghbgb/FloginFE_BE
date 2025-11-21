import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../services/api";
import { validatePassword, validateUsername } from "../utils/validation";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    // Validate inputs
    const usernameValidation = validateUsername(formData.username);
    const passwordValidation = validatePassword(formData.password);

    if (!usernameValidation.isValid || !passwordValidation.isValid) {
      setErrors([...usernameValidation.errors, ...passwordValidation.errors]);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.login(formData);

      if (response.data.success) {
        login(response.data.token);
        navigate("/dashboard");
      } else {
        setErrors([response.data.message]);
      }
    } catch (error: any) {
      setErrors([error.response?.data?.message || "Login failed"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container" data-testid="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {errors.length > 0 && (
          <div className="error-message" data-testid="login-error">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            data-testid="username-input"
          />
          {validateUsername(formData.username).errors.map((error, index) => (
            <div
              key={index}
              className="field-error"
              data-testid="username-error"
            >
              {error}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            data-testid="password-input"
          />
          {validatePassword(formData.password).errors.map((error, index) => (
            <div
              key={index}
              className="field-error"
              data-testid="password-error"
            >
              {error}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="login-button"
          data-testid="login-button"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
