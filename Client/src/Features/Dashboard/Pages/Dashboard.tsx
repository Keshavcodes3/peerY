import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Compass, Users, Folder,
    ArrowRight, Activity, MessageSquare, Award, Clock,
    Mail, Bookmark, Check, X, Loader2, Plus, LayoutGrid, Sparkles, ClipboardList, Bell
} from "lucide-react";
import { useAuth } from "../../Auth/Hooks/useAuth";
import dashboardService, {
    type WorkspaceProject,
    type Invitation,
    type BookmarkedProject
} from "../services/dashboard.service";
import { api, ENDPOINT } from "../../../App/api";

type TabType = "overview" | "workspaces" | "invitations" | "bookmarks" | "applications";

interface ProjectApplication {
    _id: string;
    project: {
        _id: string;
        title: string;
        description: string;
    };
    coverLetter?: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    createdAt: string;
}

export default function Dashboard() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [ownedProjects, setOwnedProjects] = useState<WorkspaceProject[]>([]);
    const [memberships, setMemberships] = useState<WorkspaceProject[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [bookmarks, setBookmarks] = useState<BookmarkedProject[]>([]);
    const [applications, setApplications] = useState<ProjectApplication[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const loadDashboardData = async () => {
        setIsDataLoading(true);
        try {
            const [ownedRes, memberRes, inviteRes, bookmarkRes, appsRes] = await Promise.all([
                dashboardService.getMyOwnedProjects(),
                dashboardService.getMyMemberships(),
                dashboardService.getMyInvitations(),
                dashboardService.getMyBookmarks(),
                api.get<{ success: boolean; data: { applications: ProjectApplication[] } }>(ENDPOINT.applications.myApplications)
            ]);
            setOwnedProjects(ownedRes);
            setMemberships(memberRes);
            setInvitations(inviteRes.filter(i => i.status === "PENDING"));
            setBookmarks(bookmarkRes);
            setApplications(appsRes.data?.data?.applications ?? []);
        } catch (error) {
            console.error("Error loading dashboard details:", error);
            showToast("Failed to sync some dashboard items.");
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => { loadDashboardData(); }, []);

    const handleAcceptInvite = async (inviteId: string) => {
        setActionId(inviteId);
        try {
            const success = await dashboardService.acceptInvitation(inviteId);
            if (success) {
                showToast("🎉 Invitation accepted! Welcome to the workspace.");
                await loadDashboardData();
            } else {
                showToast("Failed to accept invitation.");
            }
        } catch {
            showToast("Error responding to invitation.");
        } finally {
            setActionId(null);
        }
    };

    const handleRejectInvite = async (inviteId: string) => {
        setActionId(inviteId);
        try {
            const success = await dashboardService.rejectInvitation(inviteId);
            if (success) {
                showToast("Invitation declined.");
                setInvitations(prev => prev.filter(i => i._id !== inviteId));
            } else {
                showToast("Failed to decline invitation.");
            }
        } catch {
            showToast("Error declining invitation.");
        } finally {
            setActionId(null);
        }
    };

    const handleWithdrawApplication = async (appId: string) => {
        setActionId(appId);
        try {
            const res = await api.patch(ENDPOINT.applications.withdraw(appId));
            if (res.data.success) {
                showToast("Application withdrawn.");
                setApplications(prev => prev.filter(a => a._id !== appId));
            }
        } catch {
            showToast("Failed to withdraw application.");
        } finally {
            setActionId(null);
        }
    };

    const totalProjects = ownedProjects.length + memberships.length;

    const quickLinks = [
        {
            to: "/discover",
            title: "Discover Builders",
            description: "Swipe through developers that match your stack and values.",
            icon: Compass,
            accent: "text-blue-600",
            iconBg: "bg-blue-50 border-blue-100",
        },
        {
            to: "/network",
            title: "Your Network",
            description: "Manage your connections, pending requests, and mutual matches.",
            icon: Users,
            accent: "text-emerald-600",
            iconBg: "bg-emerald-50 border-emerald-100",
        },
        {
            to: "/projects",
            title: "Your Projects",
            description: "Create projects, manage candidates, and track milestones.",
            icon: Folder,
            accent: "text-violet-600",
            iconBg: "bg-violet-50 border-violet-100",
        },
    ];

    const mockActivities = [
        { id: 1, title: "Mutual Match! 🎉", detail: "Start chatting with your new connection.", time: "10 mins ago", type: "match" },
        { id: 2, title: "New Invitation Received", detail: "You've been invited to join a project.", time: "2 hours ago", type: "invite" },
        { id: 3, title: "Application Update", detail: "Your application status has been updated.", time: "Yesterday", type: "application" },
    ];

    return (
        <div className="min-h-full bg-zinc-50/30 text-zinc-900 font-sans relative">

            {/* Toast Banner */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-zinc-950 text-white text-xs font-semibold px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
                    >
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">

                {/* Hero / Greeting Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                            </span>
                            Active Builder Mode
                        </span>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-950 font-display capitalize">
                            Welcome back, {user?.username ?? "builder"} 👋
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium">
                            {user?.email}
                            {user && !user.emailVerified && (
                                <span className="ml-2.5 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-xs text-amber-700 font-bold uppercase tracking-wider">
                                    Pending Verification
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            to="/network"
                            className="w-10 h-10 border border-zinc-200 hover:border-zinc-300 rounded-2xl bg-white text-zinc-500 hover:text-zinc-900 shadow-sm flex items-center justify-center relative transition-all"
                            title="Notifications & Invitations"
                        >
                            <Bell size={16} />
                            {invitations.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-bold text-white items-center justify-center leading-none">{invitations.length}</span>
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-100 p-4 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                <Award size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Builder Rank</p>
                                <p className="text-sm font-bold text-zinc-950">Level 1 · Contributor</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-zinc-200 gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { id: "overview", label: "Overview", icon: LayoutGrid },
                        { id: "workspaces", label: `Workspaces (${totalProjects})`, icon: Folder },
                        { id: "invitations", label: `Invitations (${invitations.length})`, icon: Mail },
                        { id: "bookmarks", label: `Bookmarks (${bookmarks.length})`, icon: Bookmark },
                        { id: "applications", label: `Applications (${applications.length})`, icon: ClipboardList }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-zinc-500 hover:text-zinc-900"
                                }`}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Contents */}
                <div className="min-h-[300px]">
                    {isDataLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
                            <Loader2 size={24} className="animate-spin text-blue-600" />
                            <span className="text-xs font-semibold">Syncing builder workspaces…</span>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">

                            {/* OVERVIEW TAB */}
                            {activeTab === "overview" && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-8"
                                >
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {quickLinks.map((link, i) => (
                                            <motion.div
                                                key={link.title}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.06 * i }}
                                            >
                                                <Link
                                                    to={link.to}
                                                    className="group block h-full bg-white border border-zinc-200/80 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5"
                                                >
                                                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${link.iconBg}`}>
                                                        <link.icon className={`h-5 w-5 ${link.accent}`} />
                                                    </div>
                                                    <h3 className="mt-5 text-base font-bold text-zinc-950 tracking-tight font-display">{link.title}</h3>
                                                    <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{link.description}</p>
                                                    <div className="mt-5 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors pt-4 border-t border-zinc-50">
                                                        <span>Enter Console</span>
                                                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-3">
                                        {/* Activity Feed */}
                                        <div className="md:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4">
                                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                <Activity size={13} /> Live Builder Activity
                                            </h3>
                                            <div className="divide-y divide-zinc-100">
                                                {mockActivities.map(activity => (
                                                    <div key={activity.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100 text-zinc-500">
                                                            <MessageSquare size={13} />
                                                        </div>
                                                        <div className="flex-1 space-y-0.5">
                                                            <h4 className="text-sm font-bold text-zinc-950">{activity.title}</h4>
                                                            <p className="text-xs text-zinc-500">{activity.detail}</p>
                                                        </div>
                                                        <div className="text-[10px] text-zinc-400 flex items-center gap-1 shrink-0 font-medium">
                                                            <Clock size={10} /> {activity.time}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats panel */}
                                        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your Network</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                        <p className="text-2xl font-black text-zinc-950">{totalProjects}</p>
                                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Projects</p>
                                                    </div>
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                        <p className="text-2xl font-black text-zinc-950">{bookmarks.length}</p>
                                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Bookmarks</p>
                                                    </div>
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                        <p className="text-2xl font-black text-zinc-950">{invitations.length}</p>
                                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Invites</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 leading-relaxed pt-4 mt-4 border-t border-zinc-100">
                                                Real-time activity, notifications, and reputation ledger coming soon.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* WORKSPACES TAB */}
                            {activeTab === "workspaces" && (
                                <motion.div
                                    key="workspaces"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold font-display text-zinc-950">Active Workspaces</h2>
                                        <Link
                                            to="/projects"
                                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-colors"
                                        >
                                            <Plus size={14} /> New Project
                                        </Link>
                                    </div>

                                    {totalProjects === 0 ? (
                                        <div className="border border-zinc-200/80 bg-white rounded-2xl p-12 text-center space-y-3">
                                            <Folder size={32} className="text-zinc-300 mx-auto" />
                                            <h3 className="text-base font-bold text-zinc-950">No workspaces yet</h3>
                                            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                                Discover matches, apply to open roles, or launch your own project.
                                            </p>
                                            <Link to="/discover" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 pt-2">
                                                Discover builders →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {[...ownedProjects.map(p => ({ ...p, role: "Owner" })), ...memberships.map(p => ({ ...p, role: "Contributor" }))].map(proj => (
                                                <div key={proj._id} className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 hover:border-zinc-300 transition-colors flex flex-col justify-between">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                                proj.role === "Owner"
                                                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            }`}>{proj.role}</span>
                                                            <span className="text-[10px] font-mono text-zinc-400 capitalize">{proj.Stage || "Idea"}</span>
                                                        </div>
                                                        <h3 className="text-base font-bold text-zinc-950 tracking-tight font-display">{proj.title}</h3>
                                                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{proj.description}</p>
                                                    </div>
                                                    <div className="pt-4 border-t border-zinc-50 flex justify-between items-center text-xs">
                                                        <span className="font-semibold text-zinc-400">{proj.membersCount || 1} members</span>
                                                        <Link to={`/project/${proj._id}/workspace`} className="font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1">
                                                            <span>Open Workspace</span>
                                                            <ArrowRight size={12} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* INVITATIONS TAB */}
                            {activeTab === "invitations" && (
                                <motion.div
                                    key="invitations"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold font-display text-zinc-950">Pending Invitations</h2>

                                    {invitations.length === 0 ? (
                                        <div className="border border-zinc-200/80 bg-white rounded-2xl p-12 text-center space-y-3">
                                            <Mail size={32} className="text-zinc-300 mx-auto" />
                                            <h3 className="text-base font-bold text-zinc-950">Inbox is clean</h3>
                                            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                                No pending project invites. Showcase your profile to gain visibility.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {invitations.map(invite => (
                                                <div key={invite._id} className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-base font-bold text-zinc-950 font-display">
                                                                {invite.project?.title || "Project Invitation"}
                                                            </h3>
                                                            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                                                                {invite.role || "Member"}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                                            {invite.project?.description || "No description provided."}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                                                        <button
                                                            onClick={() => handleRejectInvite(invite._id)}
                                                            disabled={actionId === invite._id}
                                                            className="flex-1 md:flex-none h-9 px-4 border border-zinc-200 hover:border-red-200 hover:text-red-600 rounded-full text-xs font-bold text-zinc-600 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                                        >
                                                            {actionId === invite._id ? <Loader2 size={11} className="animate-spin" /> : <X size={12} />}
                                                            Decline
                                                        </button>
                                                        <button
                                                            onClick={() => handleAcceptInvite(invite._id)}
                                                            disabled={actionId === invite._id}
                                                            className="flex-1 md:flex-none h-9 px-5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                                        >
                                                            {actionId === invite._id ? <Loader2 size={11} className="animate-spin" /> : <Check size={12} />}
                                                            Accept
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* BOOKMARKS TAB */}
                            {activeTab === "bookmarks" && (
                                <motion.div
                                    key="bookmarks"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold font-display text-zinc-950">Bookmarked Projects</h2>

                                    {bookmarks.length === 0 ? (
                                        <div className="border border-zinc-200/80 bg-white rounded-2xl p-12 text-center space-y-3">
                                            <Bookmark size={32} className="text-zinc-300 mx-auto" />
                                            <h3 className="text-base font-bold text-zinc-950">No bookmarks saved</h3>
                                            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                                Bookmark projects from the discovery list to keep an eye on them.
                                            </p>
                                            <Link to="/discover" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 pt-2">
                                                Browse projects →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {bookmarks.map(bm => {
                                                const proj = bm.project;
                                                if (!proj) return null;
                                                return (
                                                    <div key={bm._id} className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 hover:border-zinc-300 transition-colors flex flex-col justify-between">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <span className="bg-violet-50 text-violet-600 border border-violet-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                                                                    {proj.Stage || "Idea"}
                                                                </span>
                                                                {proj.commitment && (
                                                                    <span className="text-[10px] text-zinc-400 font-mono">{proj.commitment}</span>
                                                                )}
                                                            </div>
                                                            <h3 className="text-base font-bold text-zinc-950 font-display">{proj.title}</h3>
                                                            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{proj.description}</p>
                                                        </div>
                                                        {proj.techStack && proj.techStack.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {proj.techStack.slice(0, 3).map((tech: string) => (
                                                                    <span key={tech} className="bg-zinc-50 border border-zinc-200 text-zinc-500 text-[9px] font-bold px-2 py-0.5 rounded">{tech}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="pt-4 border-t border-zinc-50 flex justify-end text-xs">
                                                            <Link to="/bookmarks" className="font-bold text-zinc-900 hover:text-blue-600 flex items-center gap-1">
                                                                <span>View all</span>
                                                                <ArrowRight size={11} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* APPLICATIONS TAB */}
                            {activeTab === "applications" && (
                                <motion.div
                                    key="applications"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold font-display text-zinc-950">My Applications</h2>

                                    {applications.length === 0 ? (
                                        <div className="border border-zinc-200/80 bg-white rounded-2xl p-12 text-center space-y-3">
                                            <ClipboardList size={32} className="text-zinc-300 mx-auto" />
                                            <h3 className="text-base font-bold text-zinc-950">No applications sent</h3>
                                            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                                Apply to open project roles and workspaces to start collaborating.
                                            </p>
                                            <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 pt-2">
                                                Explore projects →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {applications.map(app => (
                                                <div key={app._id} className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-sm font-bold text-zinc-950 font-display">
                                                                {app.project?.title || "Project Application"}
                                                            </h3>
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                                                                app.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                app.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                app.status === "WITHDRAWN" ? "bg-zinc-50 text-zinc-400 border-zinc-150" :
                                                                "bg-blue-50 text-blue-600 border-blue-100 animate-pulse"
                                                            }`}>{app.status}</span>
                                                        </div>
                                                        <p className="text-xs text-zinc-500 leading-relaxed font-light line-clamp-2">
                                                            {app.coverLetter || "No cover letter submitted."}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 font-mono">
                                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {app.status === "PENDING" && (
                                                        <div className="shrink-0 w-full md:w-auto">
                                                            <button
                                                                onClick={() => handleWithdrawApplication(app._id)}
                                                                disabled={actionId === app._id}
                                                                className="w-full md:w-auto h-9 px-4 border border-zinc-200 hover:border-red-200 hover:text-red-600 rounded-full text-xs font-bold text-zinc-600 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                                            >
                                                                {actionId === app._id ? <Loader2 size={11} className="animate-spin" /> : <X size={12} />}
                                                                Withdraw Application
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}
