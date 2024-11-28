'use client';

import {
    Sidebar, SidebarHeader, SidebarContent, SidebarGroup,
    SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bot, Presentation, CreditCard } from "lucide-react";
import Link from "next/link";
import { useProject } from "@/hooks/use-project";

const items = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Q&A", url: "/qa", icon: Bot },
    { title: "Meetings", url: "/meetings", icon: Presentation },
    { title: "Billing", url: "/billing", icon: CreditCard }
];

const AppSidebar = () => {
    const { projectId, projects = [], setProjectId } = useProject();

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>Logo</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className="list-none bg-primary !text-white">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Your projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects.map((project) => (
                                <SidebarMenuButton asChild key={project.id}>
                                    <div onClick={() => setProjectId(project.id)}>
                                        <div
                                            className={cn(`
                                            rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary`, {
                                                'bg-primary text-white': project.id === projectId
                                            })}
                                        >
                                            {project.name[0]}
                                        </div>
                                    </div>
                                </SidebarMenuButton>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
