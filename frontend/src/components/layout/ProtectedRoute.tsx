import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
