import { ClipboardList, House, LogOut } from "lucide-react";
import { Menu } from "../types/layout.types";

export const menuItems: Menu[] = [
  {
    label: "Logout",
    key: "logout",
    logo: LogOut,
  },
];

export const sideBarNavigations = [
  {
    name: "Home",
    url: "/dashboard",
    icon: House,
    key: "home",
  },
  {
    name: "My tasks",
    url: "/tasks",
    icon: ClipboardList,
    key: "tasks",
  },
];
