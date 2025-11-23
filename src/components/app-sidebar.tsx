"use client"

import * as React from "react"
import {
    Command,
    LayoutDashboard,
    Settings,
    ChevronDown,
    User,
    LogOut,
    HelpCircle,
    Zap,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { agents, AgentCategory } from "@/data/agents"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    // Group agents by category
    const groupedAgents = agents.reduce((acc, agent) => {
        if (!acc[agent.category]) {
            acc[agent.category] = []
        }
        acc[agent.category].push(agent)
        return acc
    }, {} as Record<AgentCategory, typeof agents>)

    return (
        <Sidebar {...props} className="border-r border-sidebar-border/50">
            {/* Premium Header */}
            <SidebarHeader className="border-b border-sidebar-border/50 bg-gradient-to-b from-sidebar to-sidebar/95 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-all duration-300 group/logo">
                            <Link href="/">
                                <div className="flex aspect-square size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 shadow-xl shadow-primary/20 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/20 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/30 via-purple-500/30 to-blue-500/30 opacity-0 group-hover/logo:opacity-50 transition-opacity duration-500"></div>
                                    <Command className="size-5 text-white relative z-10 drop-shadow-lg" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold text-base bg-gradient-to-r from-sidebar-foreground via-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">
                                        IntelliBiz
                                    </span>
                                    <span className="text-xs text-sidebar-foreground/50 font-medium">Agent Platform</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Stats Badge */}
                <div className="mt-3 mx-3 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-sidebar-foreground/70 font-medium">Total Agents</span>
                        <div className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            <span className="font-bold text-sidebar-foreground">{agents.length}</span>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            {/* Scrollable Content */}
            <SidebarContent className="px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
                {/* Platform Section */}
                <SidebarGroup className="pt-2">
                    <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/"}
                                    className="hover:bg-sidebar-accent/70 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-purple-500/20 data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20 data-[active=true]:border-l-2 data-[active=true]:border-primary"
                                >
                                    <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                                        <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === "/settings"}
                                    className="hover:bg-sidebar-accent/70 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-purple-500/20 data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20 data-[active=true]:border-l-2 data-[active=true]:border-primary"
                                >
                                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                                        <Settings className="h-4 w-4 flex-shrink-0" />
                                        <span className="font-medium">Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Divider */}
                <div className="px-3 py-2">
                    <Separator className="bg-sidebar-border/30" />
                </div>

                {/* Agent Categories */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
                        AI Agents
                    </SidebarGroupLabel>
                </SidebarGroup>

                {Object.entries(groupedAgents).map(([category, categoryAgents], index) => (
                    <Collapsible key={category} defaultOpen className="group/collapsible">
                        <SidebarGroup className="pb-1">
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="flex w-full items-center justify-between hover:bg-sidebar-accent/50 rounded-lg px-3 py-2.5 transition-all duration-200 group/trigger">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-sidebar-foreground/90 group-hover/trigger:text-sidebar-foreground transition-colors">
                                            {category}
                                        </span>
                                        <span className="text-xs font-semibold text-sidebar-foreground/40 bg-sidebar-accent/50 px-1.5 py-0.5 rounded group-hover/trigger:bg-sidebar-accent/70 transition-colors">
                                            {categoryAgents.length}
                                        </span>
                                    </div>
                                    <ChevronDown className="ml-auto h-4 w-4 text-sidebar-foreground/60 transition-all duration-300 group-data-[state=open]/collapsible:rotate-180 group-hover/trigger:text-sidebar-foreground" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in">
                                <SidebarGroupContent>
                                    <SidebarMenu className="mt-1 space-y-0.5">
                                        {categoryAgents.map((agent) => (
                                            <SidebarMenuItem key={agent.id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/agent/${agent.id}`}
                                                    className="hover:bg-sidebar-accent/70 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-purple-500/20 data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20 data-[active=true]:border-l-2 data-[active=true]:border-primary"
                                                >
                                                    <Link href={`/agent/${agent.id}`} className="flex items-center gap-3 px-3 py-2 rounded-lg group/item">
                                                        <agent.icon className="h-4 w-4 flex-shrink-0 text-sidebar-foreground/70 group-hover/item:text-sidebar-foreground transition-colors" />
                                                        <span className="text-sm text-sidebar-foreground/80 group-hover/item:text-sidebar-foreground transition-colors">{agent.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>

            {/* Premium Footer */}
            <SidebarFooter className="border-t border-sidebar-border/50 bg-gradient-to-t from-sidebar to-sidebar/95 p-3">
                <SidebarMenu>
                    {/* User Profile Section */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="hover:bg-sidebar-accent/50 transition-all duration-200 group/profile"
                        >
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 group-hover/profile:from-primary/30 group-hover/profile:to-purple-500/30 transition-all duration-300">
                                    <User className="h-4 w-4 text-sidebar-foreground" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <span className="text-sm font-semibold text-sidebar-foreground truncate w-full">Demo User</span>
                                    <span className="text-xs text-sidebar-foreground/50">demo@intellibiz.ai</span>
                                </div>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Quick Actions */}
                    <div className="flex gap-1 mt-2">
                        <SidebarMenuItem className="flex-1">
                            <SidebarMenuButton
                                asChild
                                className="hover:bg-sidebar-accent/50 transition-all duration-200 justify-center"
                            >
                                <button className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg">
                                    <HelpCircle className="h-4 w-4 text-sidebar-foreground/70" />
                                    <span className="text-xs text-sidebar-foreground/70">Help</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="flex-1">
                            <SidebarMenuButton
                                asChild
                                className="hover:bg-destructive/20 transition-all duration-200 justify-center"
                            >
                                <button className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg">
                                    <LogOut className="h-4 w-4 text-sidebar-foreground/70" />
                                    <span className="text-xs text-sidebar-foreground/70">Logout</span>
                                </button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </div>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
