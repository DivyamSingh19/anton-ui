"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function NavUser({
  user: userProp,
}: {
  user?: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { logout, user: contextUser, loading } = useAuth()

  // Prioritize context user, then prop, then placeholder
  const displayName = contextUser?.username || userProp?.name || "User"
  const displayEmail = contextUser?.email || userProp?.email || "..."
  const displayAvatar = userProp?.avatar || "" // contextUser might not have avatar yet

  if (loading && !contextUser) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-white/5" />
            <div className="space-y-1">
              <div className="h-3 w-20 bg-white/5 rounded" />
              <div className="h-2 w-28 bg-white/5 rounded" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-8 w-8 rounded-full border border-white/10 shadow-sm shrink-0">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="rounded-full bg-primary/10 text-primary uppercase text-xs font-bold">
                  {displayName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-white">{displayName}</span>
                <span className="truncate text-[10px] text-muted-foreground tracking-tight">
                  {displayEmail}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-3.5 text-muted-foreground/50 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-zinc-950 border-white/5 shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback className="rounded-full bg-primary/10 text-primary uppercase text-xs font-bold">
                    {displayName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer transition-colors">
                <CircleUserRoundIcon className="size-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer transition-colors">
                <CreditCardIcon className="size-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer transition-colors">
                <BellIcon className="size-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10 transition-all duration-200">
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
