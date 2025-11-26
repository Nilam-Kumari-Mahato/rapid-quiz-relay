import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export default function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <img src="https://ik.imagekit.io/devsoc/Quizora/public/logo.png?updatedAt=1764162094557" alt="Quizora Logo" className="h-8 w-8 rounded-lg" />
          </div>
          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate font-semibold">Quizora</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
