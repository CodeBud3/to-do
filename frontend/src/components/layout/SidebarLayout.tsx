import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar/AppSidebar";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="sidebar-custom">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <SidebarTrigger
          className="sticky top-0 left-0"
          {...applyTestAttributes("sidenav", "trigger")}
        />
        <main className="flex-1 px-7 py-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
