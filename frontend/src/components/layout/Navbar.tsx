import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";
import DropdownMenuComponent from "@/components/wrappers/DropdownMenu/DropdownMenuComponent";
import { Button } from "../ui/button";
import { Menu } from "./types/layout.types";

export default function Navbar() {
  const { logout, user } = useAuth();
  const onLogout = () => {
    logout();
  };
  const menu: Menu[] = [
    {
      label: "Logout",
      onClick: onLogout,
      key: "logout",
    },
  ];
  return (
    <div className="flex justify-between nav-bar-box-model bg-gray-100 border-b-1 border-b-gray-300 drop-shadow-md">
      <div className="flex items-center h-full justify-center logo">
        <div className="flex-center w-10 h-10 bg-black rounded-sm drop-shadow-lg">
          <Link to="/" {...applyTestAttributes("nav", "logo")}>
            <Code color="white"></Code>
          </Link>
        </div>

        <div className="logo-text text-2xl pl-2">CodeBud</div>
      </div>
      {user && (
        <div className="profile flex-center">
          <DropdownMenuComponent menu={menu}>
            <Button
              {...applyTestAttributes("nav", "profile")}
              className="flex border-1 border-black border-solid rounded-2xl p-1 w-10 h-10"
              variant={"ghost"}
            >
              <img src="/icons/avatar.svg" alt="@shadcn" />
            </Button>
          </DropdownMenuComponent>
        </div>
      )}
    </div>
  );
}
