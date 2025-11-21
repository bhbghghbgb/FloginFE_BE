import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

// Main wrapper that includes all necessary providers
export const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Router>
      <AuthProvider>{children}</AuthProvider>
    </Router>
  );
};

// Router-only wrapper for tests that don't need auth
export const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Router>{children}</Router>;
};

// Auth-only wrapper for tests that don't need routing
export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
