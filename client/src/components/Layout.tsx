import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Radio, Bell, Settings, Leaf,
  FileText, Map, BarChart3, Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Chatbot } from "@/components/Chatbot";
import { AccessibilityBar } from "@/components/AccessibilityBar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home,           label: "Início",         href: "/" },
    { icon: LayoutDashboard,label: "Painel",          href: "/dashboard" },
    { icon: Map,            label: "CERES Maps",      href: "/maps" },
    { icon: BarChart3,      label: "CERES Insights",  href: "/insights" },
    { icon: Bell,           label: "Alertas",         href: "/alerts" },
    { icon: Radio,          label: "Sensores",        href: "/sensors" },
    { icon: FileText,       label: "Relatórios",      href: "/reports" },
    { icon: Settings,       label: "Configurações",   href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-card border-r border-border/50 flex flex-col sticky top-0 md:h-screen z-20">
          <div className="p-5 flex items-center gap-3 border-b border-border/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/10">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl leading-none tracking-tight">CERES AI</h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Registro Ambiental Rural</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location === item.href ||
                (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="text-sm">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-primary">Sistema Online</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Monitorando o Cerrado Brasileiro.
              <br />
              haCARthon 2026
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
      <Chatbot />
      <AccessibilityBar />
    </div>
  );
}
