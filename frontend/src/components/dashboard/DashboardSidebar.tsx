import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
  PenTool,
  Sparkles,
} from "lucide-react";

export const DashboardSidebar = ({ closeSheet }: { closeSheet?: () => void }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          onClick={closeSheet}
        >
          <PenTool className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            BlogVerse
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            New
          </span>
        </Link>
      </div>
      <nav className="space-y-1">
        <Link to="/dashboard">
          <Button
            variant={isActive("/dashboard") ? "secondary" : "ghost"}
            className="w-full justify-start font-medium"
            onClick={closeSheet}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
        </Link>

        <Link to="/dashboard/articles/create">
          <Button
            variant={isActive("/dashboard/articles/create") ? "secondary" : "ghost"}
            className="w-full justify-start font-medium"
            onClick={closeSheet}
          >
            <FileText className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>

        <Link to="/articles">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium"
            onClick={closeSheet}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Explore All
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-muted-foreground cursor-not-allowed opacity-60"
          onClick={closeSheet}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-muted-foreground cursor-not-allowed opacity-60"
          onClick={closeSheet}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </div>
  );
};
