import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isUserLoggedIn } = useAuth();
  return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
