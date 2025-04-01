import { Menu } from "@/components/layout/types/layout.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";
import { useState } from "react";

export default function DropdownMenuComponent(props: any) {
  const [open, setOpen] = useState(false);
  const { children, menu, ...attributes } = props;
  const toggleDropdown = () => setOpen((prev) => !prev);
  const onSelect = (menu: Menu) => {
    setOpen(false);
    // Perform your action here
    menu.onClick();
  };
  return (
    <DropdownMenu {...attributes} open={open} onOpenChange={toggleDropdown}>
      <DropdownMenuTrigger onClick={toggleDropdown} asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {menu.map((menu: Menu) => {
          return (
            <DropdownMenuItem
              {...applyTestAttributes("menu", menu.key)}
              key={menu.key}
              onClick={() => onSelect(menu)}
            >
              {menu.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
