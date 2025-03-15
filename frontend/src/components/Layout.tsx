import { Link, Outlet } from "react-router-dom";
import Navbar from "./modules/navbar/Navbar";

const Layout = () => {
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
