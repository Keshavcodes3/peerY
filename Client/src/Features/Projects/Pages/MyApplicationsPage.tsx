import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2, AlertCircle, ClipboardList, CheckCircle2,
    XCircle, Clock, RotateCcw, ExternalLink, Folder
} from "lucide-react";
import { api, ENDPOINT } from "../../../App/api";
import { useNavigate } from "react-router-dom";

// ─── Types ─────────────────────────────────────────────────────────────────

type AppStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

interface ApplicationProject {
    _id: string;
    title: string;
    description?: string;
    Stage?: string;
    techStack?: string[];
}

interface Application {
    _id: string;
    project: ApplicationProject;
    status: AppStatus;
    coverLetter?: string;
    portfolio?: string;
    github?: string;
    resume?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Status Config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AppStatus, { label: string; icon: React.ElementType; classes: string }> = {
    PENDING: {
        label: "Pending",
        icon: Clock,
        classes: "bg-amber-50 text-amber-600 border-amber-100",
    },
    ACCEPTED: {
        label: "Accepted",
        icon: CheckCircle2,
        classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    REJECTED: {
        label: "Rejected",
        icon: XCircle,
        classes: "bg-red-50 text-red-500 border-red-100",
    },
    WITHDRAWN: {
        label: "Withdrawn",
        icon: RotateCcw,
        classes: "bg-zinc-50 text-zinc-400 border-zinc-100",
    },
};

const FILTER_TABS: { key: "ALL" | AppStatus; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "REJECTED", label: "Rejected" },
    { key: "WITHDRAWN", label: "Withdrawn" },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function MyApplicationsPage() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"ALL" | AppStatus>("ALL");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchApplications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get<{ success: boolean; data: any }>(
                ENDPOINT.applications.myApplications
            );
            setApplications(res.data.data?.applications ?? []);
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const handleWithdraw = async (appId: string) => {
        setWithdrawingId(appId);
        try {
            await api.patch(ENDPOINT.applications.withdraw(appId));
            setApplications((prev) =>
                prev.map((a) => a._id === appId ? { ...a, status: "WITHDRAWN" as AppStatus } : a)
            );
            showToast("Application withdrawn.");
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to withdraw application.", "error");
        } finally {
            setWithdrawingId(null);
        }
    };

    const filtered = filter === "ALL" ? applications : applications.filter((a) => a.status === filter);

    const counts: Record<string, number> = {
        ALL: applications.length,
        PENDING: applications.filter((a) => a.status === "PENDING").length,
        ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
        REJECTED: applications.filter((a) => a.status === "REJECTED").length,
        WITHDRAWN: applications.filter((a) => a.status === "WITHDRAWN").length,
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 ${
                            toast.type === "error" ? "bg-red-600" : "bg-zinc-950"
                        }`}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight font-display text-zinc-950">My Applications</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        {applications.length > 0
                            ? `${applications.length} application${applications.length !== 1 ? "s" : ""} submitted`
                            : "Track all your project applications"}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/projects")}
                    className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                    <ExternalLink size={12} />
                    Browse Projects
                </button>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
                {FILTER_TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            filter === key
                                ? "bg-zinc-950 text-white border-zinc-950"
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                        }`}
                    >
                        {label}
                        {counts[key] > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                filter === key ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                            }`}>
                                {counts[key]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">Loading applications…</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <AlertCircle size={28} className="text-red-400" />
                    <p className="text-sm font-semibold text-zinc-600">{error}</p>
                    <button onClick={fetchApplications} className="text-xs font-bold text-blue-600 hover:underline">
                        Retry
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border border-zinc-200/80 bg-white rounded-3xl gap-4">
                    <div className="w-14 h-14 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center">
                        <ClipboardList size={22} className="text-zinc-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-base font-bold text-zinc-950">
                            {filter === "ALL" ? "No applications yet" : `No ${filter.toLowerCase()} applications`}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                            {filter === "ALL"
                                ? "Browse projects and apply to ones that excite you!"
                                : "Switch tabs to see your other applications."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((app) => {
                            const cfg = STATUS_CONFIG[app.status];
                            const StatusIcon = cfg.icon;
                            const isExpanded = expandedId === app._id;
                            return (
                                <motion.div
                                    key={app._id}
                                    layout
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all"
                                >
                                    {/* Card header */}
                                    <div
                                        className="flex items-center gap-4 p-5 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                                            <Folder size={17} className="text-violet-500" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-950 truncate">
                                                {app.project?.title ?? "Unknown Project"}
                                            </p>
                                            <p className="text-xs text-zinc-400 truncate mt-0.5">
                                                Applied {new Date(app.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.classes}`}>
                                                <StatusIcon size={10} />
                                                {cfg.label}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 text-zinc-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Expandable details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 pt-0 space-y-4 border-t border-zinc-50">

                                                    {/* Tech stack */}
                                                    {app.project?.techStack && app.project.techStack.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-3">
                                                            {app.project.techStack.slice(0, 5).map((t) => (
                                                                <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Cover letter */}
                                                    {app.coverLetter && (
                                                        <div>
                                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Cover Letter</p>
                                                            <p className="text-xs text-zinc-600 leading-relaxed line-clamp-4">{app.coverLetter}</p>
                                                        </div>
                                                    )}

                                                    {/* Links */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.portfolio && (
                                                            <a href={app.portfolio} target="_blank" rel="noopener noreferrer"
                                                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                                                <ExternalLink size={10} /> Portfolio
                                                            </a>
                                                        )}
                                                        {app.github && (
                                                            <a href={app.github} target="_blank" rel="noopener noreferrer"
                                                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                                                <ExternalLink size={10} /> GitHub
                                                            </a>
                                                        )}
                                                        {app.resume && (
                                                            <a href={app.resume} target="_blank" rel="noopener noreferrer"
                                                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                                                <ExternalLink size={10} /> Resume
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 pt-1">
                                                        <button
                                                            onClick={() => navigate(`/project/${app.project?._id}/workspace`)}
                                                            className="h-8 px-3 border border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                                                        >
                                                            <ExternalLink size={11} /> View Project
                                                        </button>
                                                        {app.status === "PENDING" && (
                                                            <button
                                                                onClick={() => handleWithdraw(app._id)}
                                                                disabled={withdrawingId === app._id}
                                                                className="h-8 px-3 border border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                                            >
                                                                {withdrawingId === app._id
                                                                    ? <Loader2 size={11} className="animate-spin" />
                                                                    : <RotateCcw size={11} />
                                                                }
                                                                Withdraw
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
