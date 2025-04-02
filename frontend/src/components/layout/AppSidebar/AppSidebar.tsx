"use client";

import * as React from "react";

import { UserProfile } from "./UserProfile/UserProfile";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SideBarNavigation } from "./SidebarNavigation/SidebarNavigation";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="cb-sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <UserProfile />
      </SidebarHeader>
      <SidebarContent>
        <SideBarNavigation />
      </SidebarContent>
    </Sidebar>
  );
}
