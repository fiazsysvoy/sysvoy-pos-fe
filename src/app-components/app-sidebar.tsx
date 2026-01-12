"use client"
import { Calendar, Home, Inbox, Search, Settings, Table } from "lucide-react"
import { useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { useRouter,usePathname } from "next/navigation";
// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Users",
        url: "/users",
        icon: Inbox,
    },
    {
        title: "Menu",
        url: "/menu",
        icon: Calendar,
    },
    {
        title: "Order/Table",
        url: "/orders",
        icon: Table,
    },
    {
        title: "Search",
        url: "/search",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-[#1f2326] text-white rounded-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Close" : "Menu"}
            </button>

            {/* Sidebar */}
                <Sidebar className="w-32">
                    <SidebarContent className="h-full">
                        <SidebarGroup>
                            {/* <SidebarGroupLabel>POS</SidebarGroupLabel> */}
                            <SidebarGroupContent>
                                <SidebarMenu className="flex flex-col items-center gap-4">
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title} onClick={()=> router.push(item.url)} className={`${pathname === item.url ? "bg-chart-accent dark:bg-gray-800" : ""} w-full flex flex-col items-center justify-center rounded-lg p-2`}>
                                            <SidebarMenuButton asChild>
                                                {/* <a
                          href={item.url}
                          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                        >*/}
                                                <>
                                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-full flex items-center justify-center mb-2 w-12 h-12">
                                                        <item.icon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                                    </div>


                                                    <span className="text-sm text-foreground dark:text-foreground text-center truncate w-full">
                                                        {item.title}
                                                    </span>
                                                </>

                                                {/* </a>  */}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <Link className="flex flex-col p-4 justify-center items-center"  href={'/login'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                <path fill="#cd3030ff" d="M10.24 0c3.145 0 6.057 1.395 7.988 3.744a.644.644 0 0 1-.103.92a.68.68 0 0 1-.942-.1a8.961 8.961 0 0 0-6.944-3.256c-4.915 0-8.9 3.892-8.9 8.692c0 4.8 3.985 8.692 8.9 8.692a8.962 8.962 0 0 0 7.016-3.343a.68.68 0 0 1 .94-.113a.644.644 0 0 1 .115.918C16.382 18.564 13.431 20 10.24 20C4.583 20 0 15.523 0 10S4.584 0 10.24 0Zm6.858 7.16l2.706 2.707c.262.261.267.68.012.936l-2.644 2.643a.662.662 0 0 1-.936-.01a.662.662 0 0 1-.011-.937l1.547-1.547H7.462a.662.662 0 0 1-.67-.654c0-.362.3-.655.67-.655h10.269l-1.558-1.558a.662.662 0 0 1-.011-.936a.662.662 0 0 1 .936.011Z"></path>
                            </svg>
                            <p>Logout</p>
                        </Link>
                    </SidebarFooter>
                </Sidebar>

            {/* Content overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}