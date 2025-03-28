import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import GlobalLoader from "@/components/ui/globalLoader";

const Layout = () => {
  const { user, authloading } = useAuth();
  const location = useLocation();

  if (authloading) {
    return <GlobalLoader></GlobalLoader>;
  }
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
        <footer className="p-4 bg-gray-200 text-center">© 2025 CodeBud</footer>
      </div>
    </div>
  );
};

export default Layout;
