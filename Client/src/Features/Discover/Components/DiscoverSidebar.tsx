import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Compass, Folder, MessageCircle, Users, Bookmark,
    Settings, PlusCircle, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
    { id: 'discover',  label: 'Discover',  icon: Compass,       path: '/discover',  badge: null },
    { id: 'projects',  label: 'Projects',  icon: Folder,        path: '/projects',  badge: null },
    { id: 'messages',  label: 'Messages',  icon: MessageCircle, path: '/messages',  badge: 3 },
    { id: 'matches',   label: 'Matches',   icon: Users,         path: '/matches',   badge: 7 },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark,      path: '/bookmarks', badge: null },
    { id: 'settings',  label: 'Settings',  icon: Settings,      path: '/settings',  badge: null },
];

export default function DiscoverSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeId = NAV_ITEMS.find(item =>
        location.pathname.startsWith(item.path)
    )?.id ?? 'discover';

    return (
        <aside className="w-64 h-full flex flex-col border-r border-zinc-100 bg-white/95 backdrop-blur-sm shrink-0">

            {/* Logo */}
            <div className="px-6 pt-7 pb-6 border-b border-zinc-100">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => navigate('/discover')}
                >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                        <span className="text-white font-display font-black text-sm">P</span>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-zinc-900">
                        PeerY<span className="text-blue-600">.</span>
                    </span>
                </motion.div>
                <p className="text-xs text-zinc-400 mt-2 ml-0.5">Find builders. Ship together.</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeId;
                    return (
                        <motion.button
                            key={item.id}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? 'bg-zinc-900 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                            }`}
                        >
                            <Icon
                                size={17}
                                className={isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-700 transition-colors'}
                            />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                            {isActive && (
                                <ChevronRight size={14} className="text-white/60" />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Bottom CTA */}
            <div className="px-4 pb-6 border-t border-zinc-100 pt-4">
                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all duration-200"
                >
                    <PlusCircle size={17} />
                    Create Project
                </motion.button>

                {/* Handwritten annotation */}
                <p className="font-handwriting text-zinc-400 text-sm text-center mt-4 leading-snug">
                    "Build something worth talking about."
                </p>
            </div>
        </aside>
    );
}
