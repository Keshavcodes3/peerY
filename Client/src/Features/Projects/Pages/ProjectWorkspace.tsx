import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Folder, Users, ClipboardList, X,
    Plus, Trash2, ExternalLink,
    AlertCircle, Loader2, UserMinus, Crown,
    Check, KanbanSquare
} from "lucide-react";
import { api, ENDPOINT } from "../../../App/api";
import { useAuth } from "../../Auth/Hooks/useAuth";

interface Member {
    _id: string;
    user: {
        _id: string;
        username: string;
        email: string;
    };
    role: "OWNER" | "ADMIN" | "MAINTAINER" | "MEMBER" | "VIEWER";
    permissions: any;
    status: string;
    joinedBy: string;
    joinedAt: string;
}

interface Application {
    _id: string;
    applicant: {
        _id: string;
        username: string;
        email: string;
    };
    coverLetter?: string;
    portfolio?: string;
    github?: string;
    resume?: string;
    status: string;
    createdAt: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    Stage: string;
    category: string;
    techStack: string[];
    commitment?: string;
    visibility: string;
    owner: string;
}

interface KanbanTask {
    id: string;
    title: string;
    desc: string;
    column: "todo" | "progress" | "review" | "done";
    priority: "low" | "medium" | "high";
    assignee?: string;
}

export default function ProjectWorkspace() {
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Data State
    const [project, setProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Active sub-view
    const [activeTab, setActiveTab] = useState<"overview" | "board" | "team" | "applicants">("overview");

    // Modal & Toast state
    const [actionId, setActionId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    // Kanban State (persisted via localStorage per project)
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
    const [newTaskAssignee, setNewTaskAssignee] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchWorkspaceData = async () => {
        if (!projectId) return;
        setIsLoading(true);
        setError(null);
        try {
            // Fetch project details
            const projRes = await api.get<{ success: boolean; data: { project: Project } }>(ENDPOINT.projects.get(projectId));
            setProject(projRes.data?.data?.project ?? null);

            // Fetch members
            const membersRes = await api.get<{ success: boolean; data: { members: Member[] } }>(ENDPOINT.projects.members(projectId));
            setMembers(membersRes.data?.data?.members ?? []);

            // Check if current user is owner (to fetch applications)
            const projectOwner = projRes.data?.data?.project?.owner;
            const myId = user?._id ?? user?.userId;
            if (myId === projectOwner) {
                const appsRes = await api.get<{ success: boolean; data: { applications: Application[] } }>(ENDPOINT.projects.applications(projectId));
                setApplications(appsRes.data?.data?.applications?.filter(a => a.status === "PENDING") ?? []);
            }

            // Load Kanban tasks
            const cachedTasks = localStorage.getItem(`peerY_tasks_${projectId}`);
            if (cachedTasks) {
                setTasks(JSON.parse(cachedTasks));
            } else {
                setTasks([]);
            }
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Failed to load workspace data. Ensure you are an active member.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaceData();
    }, [projectId]);

    const isProjectOwner = project ? (user?._id ?? user?.userId) === project.owner : false;

    // --- Team Handlers ---
    const handleKickMember = async (memberId: string) => {
        if (!projectId || !window.confirm("Are you sure you want to remove this member from the project?")) return;

        setActionId(memberId);
        try {
            const res = await api.delete(ENDPOINT.projects.kickMember(projectId, memberId));
            if (res.data.success) {
                showToast("Member removed.");
                setMembers(prev => prev.filter(m => m._id !== memberId));
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to kick member.");
        } finally {
            setActionId(null);
        }
    };

    const handleUpdateRole = async (memberId: string, role: string) => {
        if (!projectId) return;

        setActionId(memberId);
        try {
            const res = await api.patch(ENDPOINT.projects.updateMemberRole(projectId, memberId), { role });
            if (res.data.success) {
                showToast("Member role updated.");
                setMembers(prev => prev.map(m => m._id === memberId ? { ...m, role: role as any } : m));
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to update role.");
        } finally {
            setActionId(null);
        }
    };

    const handleTransferOwnership = async (targetUserId: string) => {
        if (!projectId || !window.confirm("WARNING: You will transfer project ownership. You will be demoted to ADMIN. Proceed?")) return;

        setActionId(targetUserId);
        try {
            const res = await api.patch(ENDPOINT.projects.transferOwner(projectId), { newOwnerId: targetUserId });
            if (res.data.success) {
                showToast("🎉 Ownership transferred successfully.");
                fetchWorkspaceData();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to transfer ownership.");
        } finally {
            setActionId(null);
        }
    };

    const handleLeaveProject = async () => {
        if (!projectId || !window.confirm("Are you sure you want to leave this project workspace?")) return;

        setActionId("leave");
        try {
            const res = await api.delete(ENDPOINT.projects.leave(projectId));
            if (res.data.success) {
                showToast("You left the project.");
                navigate("/dashboard");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to leave project.");
        } finally {
            setActionId(null);
        }
    };

    // --- Application Handlers ---
    const handleAcceptApplicant = async (appId: string) => {
        setActionId(appId);
        try {
            const res = await api.patch(ENDPOINT.applications.accept(appId));
            if (res.data.success) {
                showToast("Candidate accepted to team! 🎉");
                setApplications(prev => prev.filter(a => a._id !== appId));
                // Reload members
                const mRes = await api.get<{ success: boolean; data: { members: Member[] } }>(ENDPOINT.projects.members(projectId!));
                setMembers(mRes.data?.data?.members ?? []);
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to accept candidate.");
        } finally {
            setActionId(null);
        }
    };

    const handleRejectApplicant = async (appId: string) => {
        setActionId(appId);
        try {
            // Zod requires rejection reason min 10 chars
            const res = await api.patch(ENDPOINT.applications.reject(appId), {
                rejectionReason: "We decided to move forward with other candidates at this time."
            });
            if (res.data.success) {
                showToast("Candidate declined.");
                setApplications(prev => prev.filter(a => a._id !== appId));
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to decline candidate.");
        } finally {
            setActionId(null);
        }
    };

    // --- Kanban Handlers ---
    const saveTasks = (updated: KanbanTask[]) => {
        setTasks(updated);
        if (projectId) {
            localStorage.setItem(`peerY_tasks_${projectId}`, JSON.stringify(updated));
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const task: KanbanTask = {
            id: `${Date.now()}`,
            title: newTaskTitle.trim(),
            desc: newTaskDesc.trim(),
            column: "todo",
            priority: newTaskPriority,
            assignee: newTaskAssignee || undefined
        };

        saveTasks([...tasks, task]);
        setIsNewTaskOpen(false);
        setNewTaskTitle("");
        setNewTaskDesc("");
        setNewTaskPriority("medium");
        setNewTaskAssignee("");
        showToast("Task added to board.");
    };

    const handleDeleteTask = (id: string) => {
        saveTasks(tasks.filter(t => t.id !== id));
        showToast("Task removed from board.");
    };

    const handleMoveTask = (id: string, col: KanbanTask["column"]) => {
        saveTasks(tasks.map(t => t.id === id ? { ...t, column: col } : t));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
                <Loader2 size={36} className="animate-spin text-blue-600 mb-4" />
                <p className="text-zinc-500 text-sm font-semibold">Loading workspace console…</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
                <div className="text-center p-8 bg-white border border-zinc-200/80 rounded-3xl shadow-sm max-w-sm space-y-4">
                    <AlertCircle size={32} className="text-red-500 mx-auto" />
                    <p className="text-red-600 font-bold leading-relaxed">{error || "Project workspace not found."}</p>
                    <button onClick={() => navigate("/dashboard")} className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1.5 justify-center mx-auto">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Role tags
    const getRoleStyle = (r: string) => {
        if (r === "OWNER") return "bg-blue-50 text-blue-600 border-blue-100";
        if (r === "ADMIN") return "bg-purple-50 text-purple-600 border-purple-100";
        if (r === "MAINTAINER") return "bg-indigo-50 text-indigo-600 border-indigo-100";
        return "bg-zinc-50 text-zinc-500 border-zinc-200";
    };

    return (
        <div className="min-h-screen bg-zinc-50/50 font-sans pb-16">
            {/* Header bar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-zinc-150 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate("/projects")} className="p-1.5 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="font-display font-black text-base text-zinc-950 capitalize">{project.title}</span>
                        <span className="text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-400 px-2 py-0.5 rounded font-mono uppercase">
                            {project.category}
                        </span>
                    </div>

                    {!isProjectOwner && (
                        <button
                            onClick={handleLeaveProject}
                            disabled={actionId === "leave"}
                            className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                        >
                            Leave Workspace
                        </button>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -16, x: "-50%" }}
                        className="fixed top-6 left-1/2 z-50 bg-zinc-950 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
                {/* Navigation tabs */}
                <div className="flex gap-2 border-b border-zinc-200 pb-px">
                    {[
                        { id: "overview", label: "Overview", icon: Folder },
                        { id: "board", label: "Kanban Board", icon: KanbanSquare },
                        { id: "team", label: `Team Members (${members.length})`, icon: Users },
                        ...(isProjectOwner ? [{ id: "applicants", label: `Applicants (${applications.length})`, icon: ClipboardList }] : [])
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-zinc-400 hover:text-zinc-700"
                                }`}
                            >
                                <Icon size={15} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Sub-view Content */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {/* OVERVIEW */}
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="grid gap-6 md:grid-cols-3"
                            >
                                <div className="md:col-span-2 space-y-6">
                                    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-3 shadow-sm">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</h3>
                                        <p className="text-zinc-600 text-sm leading-relaxed capitalize">{project.description}</p>
                                    </div>

                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-3 shadow-sm">
                                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Technologies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.map(t => (
                                                    <span key={t} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4 shadow-sm text-xs font-medium">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Details</h3>
                                        <div className="divide-y divide-zinc-100">
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-zinc-400">Stage</span>
                                                <span className="font-bold text-zinc-800 uppercase">{project.Stage}</span>
                                            </div>
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-zinc-400">Commitment</span>
                                                <span className="font-bold text-zinc-800 uppercase">{project.commitment || "flexible"}</span>
                                            </div>
                                            <div className="py-2.5 flex justify-between">
                                                <span className="text-zinc-400">Visibility</span>
                                                <span className="font-bold text-zinc-800 uppercase">{project.visibility}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* KANBAN BOARD */}
                        {activeTab === "board" && (
                            <motion.div
                                key="board"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base font-bold text-zinc-950">Workspace Board</h3>
                                    <button
                                        onClick={() => setIsNewTaskOpen(true)}
                                        className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-3 py-2 rounded-full cursor-pointer transition-colors"
                                    >
                                        <Plus size={13} /> Add Task
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                                    {(["todo", "progress", "review", "done"] as const).map(col => {
                                        const colTasks = tasks.filter(t => t.column === col);
                                        const colName = col === "todo" ? "To Do" : col === "progress" ? "In Progress" : col === "review" ? "Review" : "Done";
                                        const colBg = col === "todo" ? "bg-zinc-100/50" : col === "progress" ? "bg-blue-50/20" : col === "review" ? "bg-amber-50/20" : "bg-emerald-50/20";
                                        const colDot = col === "todo" ? "bg-zinc-400" : col === "progress" ? "bg-blue-500" : col === "review" ? "bg-amber-500" : "bg-emerald-500";

                                        return (
                                            <div key={col} className={`p-4 rounded-2xl border border-zinc-200/60 min-h-[350px] ${colBg} space-y-4`}>
                                                <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                                                        <span className={`w-2 h-2 rounded-full ${colDot}`} />
                                                        {colName}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-100">{colTasks.length}</span>
                                                </div>

                                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                                    {colTasks.map(t => (
                                                        <div key={t.id} className="p-4 bg-white border border-zinc-150 rounded-xl space-y-3 shadow-sm hover:border-zinc-250 transition-all relative group">
                                                            <button
                                                                onClick={() => handleDeleteTask(t.id)}
                                                                className="absolute top-3 right-3 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>

                                                            <div>
                                                                <h4 className="text-xs font-bold text-zinc-950 font-display">{t.title}</h4>
                                                                <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{t.desc}</p>
                                                            </div>

                                                            <div className="flex justify-between items-center text-[9px] pt-2.5 border-t border-zinc-50">
                                                                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                                                                    t.priority === "high" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                                                    t.priority === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                                    "bg-zinc-50 text-zinc-500 border border-zinc-200"
                                                                }`}>{t.priority}</span>
                                                                {t.assignee && (
                                                                    <span className="font-semibold text-zinc-400 truncate max-w-[60px]" title={t.assignee}>@{t.assignee}</span>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-1 pt-1.5">
                                                                {col !== "todo" && (
                                                                    <button
                                                                        onClick={() => handleMoveTask(t.id, col === "progress" ? "todo" : col === "review" ? "progress" : "review")}
                                                                        className="flex-1 text-[8px] font-bold py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded text-zinc-500"
                                                                    >
                                                                        ◄ Prev
                                                                    </button>
                                                                )}
                                                                {col !== "done" && (
                                                                    <button
                                                                        onClick={() => handleMoveTask(t.id, col === "todo" ? "progress" : col === "progress" ? "review" : "done")}
                                                                        className="flex-1 text-[8px] font-bold py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                                    >
                                                                        Next ►
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ADD TASK DIALOG */}
                                <AnimatePresence>
                                    {isNewTaskOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-sm p-6 space-y-4"
                                            >
                                                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                                    <h3 className="text-sm font-bold text-zinc-950">Add New Task</h3>
                                                    <button onClick={() => setIsNewTaskOpen(false)} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
                                                        <X size={15} />
                                                    </button>
                                                </div>

                                                <form onSubmit={handleAddTask} className="space-y-3.5 text-xs font-semibold">
                                                    <div className="space-y-1">
                                                        <label className="text-zinc-500">Task Title *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={newTaskTitle}
                                                            onChange={e => setNewTaskTitle(e.target.value)}
                                                            placeholder="e.g. Wire API Interceptor"
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-zinc-500">Task Description</label>
                                                        <textarea
                                                            rows={2}
                                                            value={newTaskDesc}
                                                            onChange={e => setNewTaskDesc(e.target.value)}
                                                            placeholder="Details and criteria..."
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none resize-none"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="text-zinc-500">Priority</label>
                                                            <select
                                                                value={newTaskPriority}
                                                                onChange={e => setNewTaskPriority(e.target.value as any)}
                                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none"
                                                            >
                                                                <option value="low">Low</option>
                                                                <option value="medium">Medium</option>
                                                                <option value="high">High</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-zinc-500">Assignee</label>
                                                            <input
                                                                type="text"
                                                                value={newTaskAssignee}
                                                                onChange={e => setNewTaskAssignee(e.target.value)}
                                                                placeholder="Username"
                                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                                                    >
                                                        Create Task
                                                    </button>
                                                </form>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* TEAM MEMBERS */}
                        {activeTab === "team" && (
                            <motion.div
                                key="team"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="space-y-4"
                            >
                                <h3 className="text-base font-bold text-zinc-950">Project Contributor List</h3>

                                <div className="space-y-3">
                                    {members.map(m => {
                                        const isTargetMe = m.user?._id === (user?._id ?? user?.userId);

                                        return (
                                            <div key={m._id} className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-zinc-300 transition-colors">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-150 flex items-center justify-center text-zinc-500 font-bold uppercase">
                                                        {m.user?.username?.[0] ?? "U"}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-zinc-900 font-display capitalize">
                                                                {m.user?.username ?? "Contributor"}
                                                                {isTargetMe && " (You)"}
                                                            </span>
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRoleStyle(m.role)}`}>
                                                                {m.role}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-zinc-400 font-light">{m.user?.email}</span>
                                                    </div>
                                                </div>

                                                {/* Owner team tools */}
                                                {isProjectOwner && !isTargetMe && (
                                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                                        <select
                                                            value={m.role}
                                                            disabled={actionId === m._id}
                                                            onChange={(e) => handleUpdateRole(m._id, e.target.value)}
                                                            className="h-8 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold px-2 text-zinc-700"
                                                        >
                                                            <option value="MEMBER">Member</option>
                                                            <option value="MAINTAINER">Maintainer</option>
                                                            <option value="ADMIN">Admin</option>
                                                            <option value="VIEWER">Viewer</option>
                                                        </select>

                                                        <button
                                                            onClick={() => handleTransferOwnership(m.user?._id)}
                                                            disabled={actionId === m._id}
                                                            title="Transfer Project Ownership"
                                                            className="p-2 border border-zinc-200 hover:border-amber-200 text-zinc-400 hover:text-amber-600 rounded-xl cursor-pointer"
                                                        >
                                                            <Crown size={14} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleKickMember(m._id)}
                                                            disabled={actionId === m._id}
                                                            title="Kick Contributor"
                                                            className="p-2 border border-zinc-200 hover:border-red-200 text-zinc-400 hover:text-red-500 rounded-xl cursor-pointer"
                                                        >
                                                            {actionId === m._id ? <Loader2 size={14} className="animate-spin text-zinc-400" /> : <UserMinus size={14} />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* RECEIVED APPLICATIONS */}
                        {activeTab === "applicants" && isProjectOwner && (
                            <motion.div
                                key="applicants"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="space-y-4"
                            >
                                <h3 className="text-base font-bold text-zinc-950">Pending Applications</h3>

                                {applications.length === 0 ? (
                                    <div className="border border-zinc-200/80 bg-white rounded-2xl p-12 text-center space-y-3">
                                        <ClipboardList size={32} className="text-zinc-300 mx-auto" />
                                        <h3 className="text-base font-bold text-zinc-950">No applications</h3>
                                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                            No pending candidate requests are available for this project.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map(app => (
                                            <div key={app._id} className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-4 hover:border-zinc-300 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-zinc-950 capitalize font-display">
                                                            {app.applicant?.username ?? "Candidate"}
                                                        </h4>
                                                        <p className="text-xs text-zinc-400 font-light mt-0.5">{app.applicant?.email}</p>
                                                    </div>
                                                    <span className="text-[10px] text-zinc-400 font-mono">
                                                        Received {new Date(app.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-xl">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Cover Letter</span>
                                                    <p className="text-zinc-700 text-xs leading-relaxed">{app.coverLetter || "No cover letter provided."}</p>
                                                </div>

                                                {/* Candidate links */}
                                                <div className="flex flex-wrap gap-4 text-xs font-semibold text-zinc-500 pt-1">
                                                    {app.portfolio && (
                                                        <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                                            Portfolio <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                    {app.github && (
                                                        <a href={app.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-zinc-800 hover:underline">
                                                            GitHub <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                    {app.resume && (
                                                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                                            Resume <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                                                    <button
                                                        onClick={() => handleRejectApplicant(app._id)}
                                                        disabled={actionId === app._id}
                                                        className="h-9 px-4 border border-zinc-200 hover:border-red-200 hover:text-red-600 rounded-full text-xs font-bold text-zinc-600 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                                    >
                                                        {actionId === app._id ? <Loader2 size={11} className="animate-spin text-zinc-400" /> : <X size={12} />}
                                                        Decline Candidate
                                                    </button>
                                                    <button
                                                        onClick={() => handleAcceptApplicant(app._id)}
                                                        disabled={actionId === app._id}
                                                        className="h-9 px-5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                                    >
                                                        {actionId === app._id ? <Loader2 size={11} className="animate-spin" /> : <Check size={12} />}
                                                        Accept to Team
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
