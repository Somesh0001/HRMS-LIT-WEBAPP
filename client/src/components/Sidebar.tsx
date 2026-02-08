import { Link, useLocation } from "wouter";
import { Users, CalendarCheck, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          HRMS Lite
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage your team efficiently</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
