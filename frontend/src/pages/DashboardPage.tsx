import { Sidebar } from "@/components/dashboard/Sidebar";
import { BlogDashboard } from "@/components/dashboard/BlogDashboard";
import { Navbar } from "@/components/home/Navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <BlogDashboard />
      </div>
    </div>
  );
}
