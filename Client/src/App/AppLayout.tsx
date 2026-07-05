import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Compass, Folder,
    Users, MessageSquare, Bookmark, LogOut, Menu, ClipboardList, X, Bell
} from "lucide-react";
import { io } from "socket.io-client";
import { tokenStore } from "./api";
import { useAuth } from "../Features/Auth/Hooks/useAuth";

const SERVER_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", activeClass: "bg-blue-50 text-blue-700", activeIcon: "text-blue-600" },
    { to: "/discover", icon: Compass, label: "Discover", activeClass: "bg-emerald-50 text-emerald-700", activeIcon: "text-emerald-600" },
    { to: "/projects", icon: Folder, label: "Projects", activeClass: "bg-violet-50 text-violet-700", activeIcon: "text-violet-600" },
    { to: "/my-applications", icon: ClipboardList, label: "My Applications", activeClass: "bg-indigo-50 text-indigo-700", activeIcon: "text-indigo-600" },
    { to: "/network", icon: Users, label: "Network", activeClass: "bg-blue-50 text-blue-700", activeIcon: "text-blue-600" },
    { to: "/messages", icon: MessageSquare, label: "Messages", activeClass: "bg-blue-50 text-blue-700", activeIcon: "text-blue-600" },
    { to: "/bookmarks", icon: Bookmark, label: "Bookmarks", activeClass: "bg-amber-50 text-amber-700", activeIcon: "text-amber-600" },
];

interface GlobalNotification {
    id: string;
    title: string;
    message: string;
    type?: string;
}

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifications, setNotifications] = useState<GlobalNotification[]>([]);

    useEffect(() => {
        const token = tokenStore.get();
        if (!token) return;

        const socket = io(SERVER_URL, {
            auth: { token },
            transports: ["polling", "websocket"],
        });

        socket.on("notification:received", (data: { title: string; message: string; type?: string }) => {
            const newNotif: GlobalNotification = {
                id: Math.random().toString(36).substring(2, 9),
                title: data.title,
                message: data.message,
                type: data.type
            };
            setNotifications(prev => [...prev, newNotif]);

            // Auto-remove after 4.5 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
            }, 4500);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-zinc-100">
                <NavLink to="/dashboard" className="flex items-center gap-2 group">
                    <div className="relative w-7 h-7 flex items-center justify-center">
                        {/* Minimalist SVG Brand Mark */}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-950">
                            <path d="M4 4H10C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 16H10C13.3137 16 16 18.6863 16 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="19" cy="5" r="2" className="fill-blue-600" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-zinc-950">
                        PeerY
                    </span>
                </NavLink>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label, activeClass, activeIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/dashboard"}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                isActive
                                    ? activeClass
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={18} className={isActive ? activeIcon : "text-zinc-400"} />
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User footer */}
            <div className="px-3 py-4 border-t border-zinc-100">
                <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors mb-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                        {user?.username?.[0] ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zinc-950 truncate">{user?.username ?? "Builder"}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                    </div>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-red-600 transition-all cursor-pointer"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-zinc-50/50 overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-60 border-r border-zinc-100 bg-white flex-col shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/20 z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -240 }}
                            animate={{ x: 0 }}
                            exit={{ x: -240 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-zinc-100 z-50 md:hidden flex flex-col"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile topbar */}
                <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-100 bg-white/90 backdrop-blur shrink-0">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="font-display font-bold text-zinc-950">PeerY</span>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Global Real-time Notifications */}
            <div className="fixed top-6 right-6 z-50 pointer-events-none flex flex-col gap-3 max-w-sm w-full">
                <AnimatePresence>
                    {notifications.map(notif => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                            className="pointer-events-auto bg-zinc-950 border border-zinc-800 text-white rounded-2xl p-4 shadow-2xl flex flex-col gap-1 backdrop-blur-md bg-zinc-950/95"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black tracking-wide text-blue-400 flex items-center gap-1.5 uppercase">
                                    <Bell size={12} className="text-blue-500 animate-bounce" />
                                    {notif.title}
                                </span>
                                <button 
                                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-full"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-medium">{notif.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
