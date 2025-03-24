import { getLoggedInUser } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AuthResponse } from "@/types/auth.types";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user) {
      // fetch user profile
      getLoggedInUser()
        .then((data: AuthResponse) => {
          setUser(data.data.user);
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err);
          // handle error here, e.g., logout user
        });
    }
  }, [user]);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
