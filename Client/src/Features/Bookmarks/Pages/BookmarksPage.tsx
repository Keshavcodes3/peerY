import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Bookmark, Loader2, AlertCircle, ArrowRight, User
} from "lucide-react";
import dashboardService, { type BookmarkedProject } from "../../Dashboard/services/dashboard.service";
import { api } from "../../../App/api";

export default function BookmarksPage() {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<BookmarkedProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"projects" | "builders">("projects");
    const [savedBuilders, setSavedBuilders] = useState<any[]>([]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2800);
    };

    const fetchBookmarks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await dashboardService.getMyBookmarks();
            setBookmarks(data);
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Failed to load bookmarks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
        const saved = localStorage.getItem("peerY_bookmarked_profiles");
        setSavedBuilders(saved ? JSON.parse(saved) : []);
    }, []);

    const handleRemove = async (projectId: string, bmId: string) => {
        setRemovingId(bmId);
        try {
            await api.delete(`/api/v1/project/${projectId}/bookmark`);
            setBookmarks(prev => prev.filter(b => b._id !== bmId));
            showToast("Bookmark removed.");
        } catch {
            showToast("Failed to remove bookmark.");
        } finally {
            setRemovingId(null);
        }
    };

    const handleRemoveBuilder = (builderId: string) => {
        const saved = localStorage.getItem("peerY_bookmarked_profiles");
        let list = saved ? JSON.parse(saved) : [];
        list = list.filter((b: any) => b._id !== builderId);
        localStorage.setItem("peerY_bookmarked_profiles", JSON.stringify(list));
        setSavedBuilders(list);
        showToast("Builder bookmark removed.");
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-950 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight font-display text-zinc-950">Bookmarks</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Manage your saved projects and builder profiles
                    </p>
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-xl w-fit border border-zinc-200/60 shrink-0">
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            activeTab === "projects"
                                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/10'
                                : 'text-zinc-500 hover:text-zinc-950'
                        }`}
                    >
                        Projects ({bookmarks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("builders")}
                        className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            activeTab === "builders"
                                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/10'
                                : 'text-zinc-500 hover:text-zinc-950'
                        }`}
                    >
                        Builders ({savedBuilders.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === "projects" ? (
                isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                        <Loader2 size={24} className="animate-spin text-blue-600" />
                        <span className="text-xs font-semibold">Loading bookmarks…</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <AlertCircle size={28} className="text-red-400" />
                        <p className="text-sm font-semibold text-zinc-600">{error}</p>
                        <button onClick={fetchBookmarks} className="text-xs font-bold text-blue-600 hover:underline">Retry</button>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-zinc-200/80 bg-white rounded-3xl gap-4">
                        <div className="w-14 h-14 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center">
                            <Bookmark size={22} className="text-zinc-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-zinc-950">No saved projects</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                                Browse projects in Discover and bookmark ones you want to revisit.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bookmarks.map(bm => {
                            const proj = bm.project;
                            if (!proj) return null;
                            return (
                                <motion.div
                                    key={bm._id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="bg-violet-50 text-violet-600 border border-violet-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                                            {proj.Stage || "Idea"}
                                        </span>
                                        {proj.commitment && (
                                            <span className="text-[10px] text-zinc-400 font-mono">{proj.commitment}</span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-zinc-950 font-display">{proj.title}</h3>
                                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{proj.description}</p>
                                    </div>

                                    {proj.techStack && proj.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {proj.techStack.slice(0, 3).map(t => (
                                                <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-zinc-50 flex justify-between items-center">
                                        <button
                                            onClick={() => handleRemove(proj._id, bm._id)}
                                            disabled={removingId === bm._id}
                                            className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            {removingId === bm._id ? (
                                                <Loader2 size={11} className="animate-spin" />
                                            ) : (
                                                "Remove"
                                            )}
                                        </button>
                                        <span
                                            onClick={() => navigate(`/project/${proj._id}/workspace`)}
                                            className="text-[10px] font-bold text-zinc-700 flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors"
                                        >
                                            View Project <ArrowRight size={11} />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )
            ) : (
                savedBuilders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-zinc-200/80 bg-white rounded-3xl gap-4">
                        <div className="w-14 h-14 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center">
                            <User size={22} className="text-zinc-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-zinc-950">No saved builders</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                                Discover builders and save their profiles to team up later.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {savedBuilders.map(builder => {
                            const initials = (builder.name || "U")[0];
                            return (
                                <motion.div
                                    key={builder._id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black uppercase shadow-sm shrink-0">
                                            {builder.avatar ? (
                                                <img src={builder.avatar} alt={builder.name} className="w-full h-full object-cover rounded-xl" />
                                            ) : initials}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-zinc-950 truncate">{builder.name}</h3>
                                            <p className="text-[10px] text-zinc-400 capitalize truncate">{builder.experience || "Intermediate"} Experience</p>
                                        </div>
                                    </div>

                                    {builder.skills && builder.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {builder.skills.slice(0, 3).map((s: string) => (
                                                <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                                        <button
                                            onClick={() => handleRemoveBuilder(builder._id)}
                                            className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            Remove
                                        </button>
                                        <span
                                            onClick={() => navigate(`/discover/${builder._id}`)}
                                            className="text-[10px] font-bold text-zinc-700 flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors"
                                        >
                                            View Profile <ArrowRight size={11} />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}
