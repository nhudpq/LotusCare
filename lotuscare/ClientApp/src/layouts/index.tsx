import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className='flex-1 w-full'>
            <div className='sticky top-0 z-50  '>
              <SidebarTrigger />
            </div>
            <div className='pb-2 mt-1 px-4 h-full'>
              <Outlet />
              {children}
            </div>
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
