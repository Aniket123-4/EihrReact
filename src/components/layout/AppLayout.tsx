import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity, Bell, CalendarDays, ChevronLeft, ChevronRight, ClipboardList, CreditCard,
  FileUp, LayoutDashboard, LogOut, Settings, Stethoscope, Users, UserPlus, Clock, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: UserPlus, label: "Walk-in Registration", path: "/walk-in" },
  { icon: CalendarDays, label: "Appointments", path: "/appointments" },
  { icon: Clock, label: "Doctor Slots", path: "/doctor-slots" },
  { icon: ClipboardList, label: "Queue / Tokens", path: "/queue" },
  { icon: Stethoscope, label: "Doctor Panel", path: "/doctor-panel" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: FileUp, label: "Documents", path: "/documents" },
  { icon: ShieldCheck, label: "Admin Panel", path: "/admin" },
];
const AppLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 z-40 glass-strong border-r border-border/50 flex flex-col"
      >
        <div className="p-4 flex items-center gap-3 border-b border-border/50">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold glow-text text-lg">
              MediFlow
            </motion.span>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer
                    ${active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${active ? "text-primary" : ""}`} />
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium truncate">
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/50 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted/50 transition-colors">
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">Settings</span>}
          </div>
          <Link to="/">
            <div className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors">
              <LogOut className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm">Logout</span>}
            </div>
          </Link>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full glass border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[260px]"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border/50 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-lg">
              {menuItems.find((m) => m.path === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
                DR
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Dr. Ramirez</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
