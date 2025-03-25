import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { applyTestAttributes } from "@/utils/formHelper";
import { Code } from "lucide-react";

export default function Navbar() {
  const { logout, user } = useAuth();
  const onLogout = () => {
    logout();
  };
  return (
    <div className="flex justify-between nav-bar-box-model bg-gray-100 border-b-1 border-b-gray-300 drop-shadow-md">
      <div className="flex items-center h-full justify-center logo">
        <div className="flex-center w-10 h-10 bg-black rounded-sm drop-shadow-lg">
          <Code color="white"></Code>
        </div>
        <div className="logo-text text-2xl pl-2">CodeBud</div>
      </div>
      {user && (
        <div className="profile flex-center">
          <Button onClick={onLogout} {...applyTestAttributes("nav", "logout")}>
            Logout {user?.firstName}
          </Button>
        </div>
      )}
    </div>
  );
}
