import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Desktop Sidebar - Hidden on mobile via CSS media query */}
      <Sidebar />
      
      {/* Mobile Navigation - Visible only on mobile via JS and CSS */}
      <MobileNav />
      
      <main className="layout-main pl-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
