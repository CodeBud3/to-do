import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";
import { menuItems } from "../sidebarConfig";

export function UserProfile() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();

  if (!user) {
    return;
  }

  const selectAction = (key: string) => {
    switch (key) {
      case "logout":
        logout();
        break;
      default:
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              {...applyTestAttributes("side-nav", "user-profile")}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <img src="/icons/avatar.svg" alt="profile-icon" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel> */}
            {menuItems.map((menu) => (
              <DropdownMenuItem
                {...applyTestAttributes("menu", menu.key)}
                key={menu.key}
                onClick={() => selectAction(menu.key)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <menu.logo className="size-4 shrink-0" />
                </div>
                {menu.label}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
