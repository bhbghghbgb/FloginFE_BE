import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setInitializing(false); // <-- auth is fully loaded
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", newToken);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
