import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="md:hidden m-4 gap-2">
            <LayoutDashboard className="h-4 w-4" /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <DashboardSidebar closeSheet={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="hidden md:block min-h-screen w-[260px] border-r bg-card/40 backdrop-blur-md">
        <DashboardSidebar />
      </div>
    </div>
  );
};
