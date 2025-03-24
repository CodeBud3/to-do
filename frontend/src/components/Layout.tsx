import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./modules/navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect '/' based on authentication status
  if (location.pathname === "/") {
    return <Navigate to={user ? "/dashboard" : "/login"} />;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <div className="page-box-model">
        <main className="flex-1">
          <Outlet /> {/* Render the current route */}
        </main>
        <footer className="p-4 bg-gray-200 text-center">© 2025 My App</footer>
      </div>
    </div>
  );
};

export default Layout;
