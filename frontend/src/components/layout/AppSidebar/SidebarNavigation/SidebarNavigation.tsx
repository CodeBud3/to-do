import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { sideBarNavigations } from "../sidebarConfig";
import { Link } from "react-router-dom";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";

export function SideBarNavigation() {
  return (
    <SidebarGroup>
      <SidebarSeparator />
      <SidebarMenu>
        {sideBarNavigations.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === item.url}
            >
              <Link to={item.url} {...applyTestAttributes("sidenav", item.key)}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
