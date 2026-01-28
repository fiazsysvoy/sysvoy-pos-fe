import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app-components/app-sidebar";
import Navbar from "@/app-components/navbar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { UserProvider } from "@/context/user-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <UserProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "8rem", // w-32
              "--sidebar-width-icon": "3rem",
            } as React.CSSProperties
          }
        >
          <div className="w-full flex">
            <AppSidebar />
            <main className="flex-1 flex flex-col bg-background">
              <Navbar />
              <div className="flex-1">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </UserProvider>
    </AuthGuard>
  );
}
