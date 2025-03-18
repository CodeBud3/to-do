import { logOut } from "@/api/auth";
import { User, AuthContextType } from "@/types/auth.types";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const isUserLoggedIn = !!token;
  // 🔹 Login Function
  const updateAuth = (user: User) => {
    let { token, ...userDetails } = user;
    token = token || "";
    setToken(token);
    setUser(userDetails);
    localStorage.setItem("token", token);
  };

  // 🔹 Logout Function
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    logOut().catch((e) => {
      console.error("Logout failed", e.message);
    });
  };

  return (
    <AuthContext.Provider
      value={{ isUserLoggedIn, updateAuth, user, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
