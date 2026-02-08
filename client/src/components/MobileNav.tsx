import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Users, CalendarCheck, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileNav() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Only render on mobile screens
  if (!isMobile) return null;

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-nav-bar fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white border-b border-slate-800 shadow-lg flex items-center justify-between px-4 z-40">
        <h1 className="text-lg font-bold font-display bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          HRMS Lite
        </h1>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-trigger p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="mobile-menu-overlay fixed inset-0 bg-black/50 z-30 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={cn(
          "mobile-menu fixed top-16 left-0 right-0 bg-slate-900 text-white border-b border-slate-800 z-30 transition-all duration-200 overflow-hidden",
          isOpen ? "max-h-screen" : "max-h-0"
        )}
      >
        <div className="flex flex-col space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}

          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-4 border-t border-slate-800 pt-4">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
