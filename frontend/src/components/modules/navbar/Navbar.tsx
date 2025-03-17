import { getLoggedInUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthResponse } from "@/types/auth.types";
import { Code } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout, isUserLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn && !user) {
      // fetch user profile
      getLoggedInUser().then((data: AuthResponse) => {
        setUser(data.data.user);
      });
    }
  }, [isUserLoggedIn]);
  const onLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex justify-between nav-bar-box-model bg-gray-100 border-b-1 border-b-gray-300 drop-shadow-md">
      <div className="flex items-center h-full justify-center logo">
        <div className="flex-center w-10 h-10 bg-black rounded-sm drop-shadow-lg">
          <Code color="white"></Code>
        </div>
        <div className="logo-text text-2xl pl-2">CodeBud</div>
      </div>
      {isUserLoggedIn && (
        <div className="profile flex-center">
          <Button onClick={onLogout}>Logout {user?.firstName}</Button>
        </div>
      )}
    </div>
  );
}
