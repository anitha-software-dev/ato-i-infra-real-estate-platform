import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopHeader } from "@/components/top-header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SidebarProvider className="max-w-full overflow-x-hidden">
        <AppSidebar variant="inset" />
        <SidebarInset className="min-w-0 max-w-full overflow-x-hidden">
          <TopHeader />
          <div className="flex-1 min-w-0 max-w-full overflow-y-auto overflow-x-hidden p-4 pb-24 md:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
