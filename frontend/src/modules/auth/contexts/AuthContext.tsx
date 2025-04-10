import { logOut } from "@/modules/auth/services/auth.service";
import { getLoggedInUser } from "@/modules/auth/services/user";
import {
  User,
  AuthContextType,
  AuthResponse,
} from "@/modules/auth/types/auth.types";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authloading, setAuthLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      setAuthLoading(true);
      // fetch user profile
      getLoggedInUser()
        .then((data: AuthResponse) => {
          setUser(data.data.user);
          setAuthLoading(false);
        })
        .catch(() => {
          setAuthLoading(false);
          setUser(null);
        });
    }
  }, [user]);
  // Login Function
  const updateAuth = (user: User) => {
    setUser(user);
  };

  // Logout Function
  const logout = () => {
    setAuthLoading(true);
    logOut()
      .then(() => {
        setUser(null);
        dispatch({ type: "RESET_STORE" });
        setAuthLoading(false);
      })
      .catch(() => {
        setAuthLoading(false);
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
