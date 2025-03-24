import { getLoggedInUser, logOut } from "@/api/auth";
import { User, AuthContextType, AuthResponse } from "@/types/auth.types";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authloading, setAuthLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!user) {
      setAuthLoading(true);
      // fetch user profile
      getLoggedInUser()
        .then((data: AuthResponse) => {
          setUser(data.data.user);
          setAuthLoading(false);
        })
        .catch((err) => {
          setAuthLoading(false);
          console.error("Failed to fetch user profile", err);
        });
    }
  }, []);
  // Login Function
  const updateAuth = (user: User) => {
    let { token, ...userDetails } = user;
    token = token || "";
    setUser(userDetails);
    localStorage.setItem("token", token);
  };

  // Logout Function
  const logout = () => {
    logOut()
      .then(() => {
        setUser(null);
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .catch((e) => {
        console.error("Logout failed", e.message);
      });
  };

  return (
    <AuthContext.Provider
      value={{ authloading, updateAuth, user, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
