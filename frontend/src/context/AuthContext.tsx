import React, { createContext, useContext, useState, useEffect } from "react";
import { Author } from "@/api/articles.api";
import {
  loginUser,
  registerUser,
  getMeUser,
  LoginData,
  RegisterData,
} from "@/api/auth.api";
import { toast } from "sonner";

interface AuthContextType {
  user: Author | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Author | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("blogverse_token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate and load user profile from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem("blogverse_token");
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getMeUser();
        const savedPlan = localStorage.getItem("blogverse_plan");
        if (savedPlan && currentUser) {
          currentUser.plan = savedPlan;
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Session expired or invalid token:", error);
        localStorage.removeItem("blogverse_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginData) => {
    const res = await loginUser(data);
    localStorage.setItem("blogverse_token", res.token);
    setToken(res.token);
    setUser(res.user);
    toast.success(`Welcome back, ${res.user.name}!`);
  };

  const register = async (data: RegisterData) => {
    const res = await registerUser(data);
    localStorage.setItem("blogverse_token", res.token);
    setToken(res.token);
    setUser(res.user);
    toast.success(`Welcome to BlogVerse, ${res.user.name}!`);
  };

  const logout = () => {
    localStorage.removeItem("blogverse_token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
