import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app-components/app-sidebar";
import Navbar from "@/app-components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="w-full flex">
        <AppSidebar />
        <main className="flex-1 flex flex-col bg-background">
          <Navbar />
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
