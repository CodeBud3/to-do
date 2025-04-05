import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import GlobalLoader from "@/components/ui/globalLoader";
import SidebarLayout from "./SidebarLayout";

const Layout = () => {
  const { user, authloading } = useAuth();
  const location = useLocation();

  if (authloading) {
    return <GlobalLoader></GlobalLoader>;
  }
  // Redirect '/' based on authentication status
  // To-Do: Create a landing page for empty route
  if (location.pathname === "/") {
    return <Navigate to={user ? "/dashboard" : "/login"} />;
  }

  const publicRouteLayout = () => (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <div className="page-box-model page-box-model-with-nav">
        <main className="flex-1">
          <Outlet /> {/* Render the current route */}
        </main>
        <footer className="p-4 bg-gray-200 text-center">© 2025 CodeBud</footer>
      </div>
    </div>
  );

  const privateRouteLayout = () => (
    <div className="min-h-screen flex flex-col">
      <div className="page-box-model">
        <SidebarLayout>
          <Outlet /> {/* Render the current route */}
          {/* </main> */}
        </SidebarLayout>
      </div>
    </div>
  );

  if (user) {
    return privateRouteLayout();
  }
  return publicRouteLayout();
};

export default Layout;
