import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"
import { LayoutDashboard, Bot, Presentation, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation"
// import { useProject } from "@/hooks/use-project"

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    }, {
        title: "Q&A",
        url: "/qa",
        icon: Bot,
    }, {
        title: "Meetings",
        url: "/meetings",
        icon: Presentation,
    }, {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
    }
]

const AppSidebar = () => {
    // const {projectId, projects } = useProject();
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                Logo
            </SidebarHeader>



            {/* <SidebarContent>
                <SidebarGroup>
                    <Sideb arGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => {
                                return (
                                    <Sidebar MenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} classN
'Ibg-primary !text-whi
'list-none')}>
                                            <item.icon />
                                            <span>{item.title}</span
</Link>
                                    </Sidebar MenuButton >
</SidebarMenuItem>
                        כך {
</Sidebar Menu>
                </SidebarGroupContent>
            </SidebarGroup>
        </Sidebar Content> */}




        </Sidebar >
    )
}

export default AppSidebar;