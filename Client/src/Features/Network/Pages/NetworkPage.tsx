import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Loader2, AlertCircle, Heart, HeartCrack, Clock,
    Mail, Check, X, UserCheck, MessageCircle, Bell,
    FolderOpen, ExternalLink
} from "lucide-react";
import { api, ENDPOINT } from "../../../App/api";
import { useAuth } from "../../Auth/Hooks/useAuth";

// ─── Types ─────────────────────────────────────────────────────────────────

interface MatchUser {
    _id: string;
    username: string;
    email: string;
}

interface Match {
    _id: string;
    userOne: MatchUser;
    userTwo: MatchUser;
    accepted: boolean;
    matchedAt?: string;
    createdAt: string;
}

interface PendingRequest {
    _id: string;
    userOne: MatchUser;
    accepted: boolean;
    createdAt: string;
}

interface InvitationProject {
    _id: string;
    title: string;
    Stage?: string;
}

interface InvitationSender {
    _id: string;
    username: string;
    email: string;
}

interface Invitation {
    _id: string;
    project: InvitationProject;
    from: InvitationSender;
    role?: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    createdAt: string;
}

// ─── Avatar Helper ──────────────────────────────────────────────────────────

const gradients = [
    "from-blue-500 to-violet-500",
    "from-amber-400 to-orange-400",
    "from-emerald-400 to-teal-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-400",
];

function getGradient(name: string) {
    const idx = (name.charCodeAt(0) || 0) % gradients.length;
    return gradients[idx];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function NetworkPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [matches, setMatches] = useState<Match[]>([]);
    const [pending, setPending] = useState<PendingRequest[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [activeTab, setActiveTab] = useState<"matches" | "pending" | "invitations">("matches");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [matchRes, pendingRes, invRes] = await Promise.all([
                api.get<{ success: boolean; data: Match[] }>(ENDPOINT.match.getAll),
                api.get<{ success: boolean; data: PendingRequest[] }>(ENDPOINT.match.pending),
                api.get<{ success: boolean; data: any }>(ENDPOINT.invitations.getMyInvitations),
            ]);
            setMatches(matchRes.data.data ?? []);
            setPending(pendingRes.data.data ?? []);
            // Only show pending invitations in this tab (invRes.data.data contains { invitations: [...] })
            const allInv = invRes.data.data?.invitations ?? [];
            setInvitations(allInv.filter((i: any) => i.status === "PENDING"));
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Failed to load network data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // ── Match actions ──────────────────────────────────────────────────────

    const handleAccept = async (matchId: string) => {
        setActionId(matchId);
        try {
            await api.put(ENDPOINT.match.accept(matchId));
            showToast("🎉 Match accepted!");
            await loadData();
        } catch {
            showToast("Failed to accept request.", "error");
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (matchId: string) => {
        setActionId(matchId);
        try {
            await api.delete(ENDPOINT.match.reject(matchId));
            showToast("Request declined.");
            setPending((prev) => prev.filter((p) => p._id !== matchId));
        } catch {
            showToast("Failed to decline request.", "error");
        } finally {
            setActionId(null);
        }
    };

    const handleUnmatch = async (matchId: string) => {
        setActionId(matchId);
        try {
            await api.delete(ENDPOINT.match.unmatch(matchId));
            showToast("Unmatched.");
            setMatches((prev) => prev.filter((m) => m._id !== matchId));
        } catch {
            showToast("Failed to unmatch.", "error");
        } finally {
            setActionId(null);
        }
    };

    // ── Invitation actions ─────────────────────────────────────────────────

    const handleInvAccept = async (invId: string) => {
        setActionId(invId);
        try {
            await api.patch(ENDPOINT.invitations.accept(invId));
            showToast("🎉 Invitation accepted! You joined the project.");
            setInvitations((prev) => prev.filter((i) => i._id !== invId));
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to accept invitation.", "error");
        } finally {
            setActionId(null);
        }
    };

    const handleInvReject = async (invId: string) => {
        setActionId(invId);
        try {
            await api.patch(ENDPOINT.invitations.reject(invId));
            showToast("Invitation declined.");
            setInvitations((prev) => prev.filter((i) => i._id !== invId));
        } catch {
            showToast("Failed to decline invitation.", "error");
        } finally {
            setActionId(null);
        }
    };

    // ── Tab definitions ────────────────────────────────────────────────────

    const tabs = [
        { id: "matches", label: "Matches", count: matches.length, icon: Heart },
        { id: "pending", label: "Requests", count: pending.length, icon: Clock },
        { id: "invitations", label: "Invitations", count: invitations.length, icon: Bell },
    ] as const;

    // ─── Render ──────────────────────────────────────────────────────────────

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
                        {toast.type === "error"
                            ? <AlertCircle size={13} className="text-red-200" />
                            : <UserCheck size={13} className="text-emerald-400" />
                        }
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight font-display text-zinc-950">Network</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Your builder connections, requests & project invitations</p>
                </div>
                <button
                    onClick={() => navigate("/discover")}
                    className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                    <ExternalLink size={12} />
                    Find Builders
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                            }`}
                        >
                            <Icon size={15} />
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                    activeTab === tab.id
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-zinc-100 text-zinc-400"
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">Loading network…</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <AlertCircle size={28} className="text-red-400" />
                    <p className="text-sm font-semibold text-zinc-600">{error}</p>
                    <button onClick={loadData} className="text-xs font-bold text-blue-600 hover:underline">
                        Try again
                    </button>
                </div>
            ) : (
                <AnimatePresence mode="wait">

                    {/* ── MATCHES TAB ─────────────────────────────────────── */}
                    {activeTab === "matches" && (
                        <motion.div
                            key="matches"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            {matches.length === 0 ? (
                                <EmptyState
                                    icon={<HeartCrack size={28} className="text-zinc-300" />}
                                    title="No matches yet"
                                    subtitle="Go to Discover to connect with builders!"
                                />
                            ) : matches.map((match) => {
                                const peer = match.userOne?._id === user?.userId ? match.userTwo : match.userOne;
                                return (
                                    <motion.div
                                        key={match._id}
                                        layout
                                        className="flex items-center gap-4 bg-white border border-zinc-200/80 rounded-2xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(peer?.username ?? "U")} flex items-center justify-center text-white text-sm font-bold uppercase shrink-0`}>
                                            {peer?.username?.[0] ?? "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-950">{peer?.username ?? "Builder"}</p>
                                            <p className="text-xs text-zinc-400 truncate">{peer?.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Heart size={9} /> Matched
                                            </span>
                                            <button
                                                onClick={() => navigate("/messages")}
                                                className="h-7 px-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full text-[10px] font-bold transition-colors flex items-center gap-1"
                                            >
                                                <MessageCircle size={11} /> Message
                                            </button>
                                            <button
                                                onClick={() => handleUnmatch(match._id)}
                                                disabled={actionId === match._id}
                                                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {actionId === match._id ? <Loader2 size={12} className="animate-spin" /> : "Unmatch"}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* ── PENDING TAB ─────────────────────────────────────── */}
                    {activeTab === "pending" && (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            {pending.length === 0 ? (
                                <EmptyState
                                    icon={<Mail size={28} className="text-zinc-300" />}
                                    title="No pending requests"
                                    subtitle="Requests from other builders will appear here."
                                />
                            ) : pending.map((req) => (
                                <motion.div
                                    key={req._id}
                                    layout
                                    className="flex items-center gap-4 bg-white border border-zinc-200/80 rounded-2xl p-4 hover:border-zinc-300 transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(req.userOne?.username ?? "U")} flex items-center justify-center text-white text-sm font-bold uppercase shrink-0`}>
                                        {req.userOne?.username?.[0] ?? "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-950">{req.userOne?.username ?? "Builder"}</p>
                                        <p className="text-xs text-zinc-400 truncate">{req.userOne?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleReject(req._id)}
                                            disabled={actionId === req._id}
                                            className="h-8 px-3 border border-zinc-200 hover:border-red-200 hover:text-red-600 rounded-full text-xs font-bold text-zinc-500 transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {actionId === req._id ? <Loader2 size={11} className="animate-spin" /> : <X size={12} />}
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            disabled={actionId === req._id}
                                            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1 shadow-sm"
                                        >
                                            {actionId === req._id ? <Loader2 size={11} className="animate-spin" /> : <Check size={12} />}
                                            Accept
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* ── INVITATIONS TAB ─────────────────────────────────── */}
                    {activeTab === "invitations" && (
                        <motion.div
                            key="invitations"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            {invitations.length === 0 ? (
                                <EmptyState
                                    icon={<Bell size={28} className="text-zinc-300" />}
                                    title="No pending invitations"
                                    subtitle="When project owners invite you to join, they'll appear here."
                                />
                            ) : invitations.map((inv) => (
                                <motion.div
                                    key={inv._id}
                                    layout
                                    className="bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-sm transition-all space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                                                <FolderOpen size={16} className="text-violet-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-950">{inv.project?.title ?? "Unknown Project"}</p>
                                                {inv.project?.Stage && (
                                                    <span className="text-[10px] font-bold text-violet-500 capitalize">{inv.project.Stage}</span>
                                                )}
                                            </div>
                                        </div>
                                        {inv.role && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full whitespace-nowrap">
                                                {inv.role}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${getGradient(inv.from?.username ?? "U")} flex items-center justify-center text-white text-[9px] font-bold uppercase`}>
                                            {inv.from?.username?.[0] ?? "?"}
                                        </div>
                                        <span>
                                            Invited by <span className="font-bold text-zinc-700">{inv.from?.username ?? "Someone"}</span>
                                        </span>
                                        <span className="text-zinc-300">·</span>
                                        <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-2 pt-1 border-t border-zinc-50">
                                        <button
                                            onClick={() => handleInvReject(inv._id)}
                                            disabled={actionId === inv._id}
                                            className="flex-1 h-9 border border-zinc-200 hover:border-red-200 hover:text-red-600 rounded-xl text-xs font-bold text-zinc-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                                        >
                                            {actionId === inv._id ? <Loader2 size={12} className="animate-spin" /> : <X size={13} />}
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleInvAccept(inv._id)}
                                            disabled={actionId === inv._id}
                                            className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            {actionId === inv._id ? <Loader2 size={12} className="animate-spin" /> : <Check size={13} />}
                                            Accept & Join
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 border border-zinc-200/80 bg-white rounded-3xl gap-4">
            {icon}
            <div className="text-center">
                <h3 className="text-base font-bold text-zinc-950">{title}</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">{subtitle}</p>
            </div>
        </div>
    );
}
