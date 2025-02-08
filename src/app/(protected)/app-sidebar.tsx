'use client'

import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Bot, Presentation, CreditCard, ChevronRight } from 'lucide-react'

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useProject } from "@/hooks/use-project"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q&A", url: "/qna", icon: Bot },
  { title: "Meetings", url: "/meetings", icon: Presentation },
  { title: "Billing", url: "/billing", icon: CreditCard }
]

const AppSidebar = () => {
  const { projectId, projects, setProjectId, isLoading } = useProject()
  const router = useRouter()

  function projectsOnclick(projectId: string) {
    setProjectId(projectId)
    router.push('/dashboard')
  }

  // const isLoading = !projects
  // if(isLoading) {
  //   return (
  //     <Loader inverse center content="loading your projects..." />
  //   )
  // }

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 flex items-center space-x-2">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary font-poppins">
            RepoScan
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Button><Link href={'/create'}>Create</Link></Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <>
                  {[...Array(3)].map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))}
                </>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      onClick={() => projectsOnclick(project.id)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out w-full",
                        project.id === projectId
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-md text-sm font-semibold",
                          project.id === projectId
                            ? "bg-blue-200 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                        )}
                      >
                        {project.name[0].toUpperCase()}
                      </div>
                      <span className="flex-grow">{project.name}</span>
                      {project.id === projectId && <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No projects available
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar

