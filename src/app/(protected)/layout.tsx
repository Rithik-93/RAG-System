import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import AppSidebar from './app-sidebar'

type Props = {
    children: React.ReactNode
}

const SidebarComp = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main className='w-full m-2'>
                <div className="flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded">
                    <div >
                        <div className="ml-auto"></div>
                        <UserButton />
                    </div>
                    <div></div>
                    <div className="border-sidebar-borderbg-sidebar">
                        {children}
                    </div>
                </div>
            </main>
        </SidebarProvider>
    )
}

export default SidebarComp;