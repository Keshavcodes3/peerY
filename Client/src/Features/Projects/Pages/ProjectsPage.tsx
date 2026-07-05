import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Folder, Plus, Loader2, ArrowRight, AlertCircle,
    LayoutGrid, Users, Crown, Edit2, Trash2, Archive,
    X, ExternalLink, Briefcase, Star, ClipboardList
} from "lucide-react";
import dashboardService, { type WorkspaceProject } from "../../Dashboard/services/dashboard.service";
import { api, ENDPOINT } from "../../../App/api";
import { useAuth } from "../../Auth/Hooks/useAuth";

interface Requirement {
    title: string;
    description: string;
    role: string;
    skills: string[];
    openings: number;
}

interface ProjectFull {
    _id: string;
    title: string;
    description: string;
    banner?: string;
    Stage?: string;
    category?: string;
    techStack?: string[];
    commitment?: string;
    membersCount?: number;
    visibility?: string;
    applicationCount?: number;
    Requiremnts?: Requirement[];
    owner: string;
}

export default function ProjectsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Data lists
    const [ownedProjects, setOwnedProjects] = useState<WorkspaceProject[]>([]);
    const [memberships, setMemberships] = useState<WorkspaceProject[]>([]);
    const [allProjects, setAllProjects] = useState<ProjectFull[]>([]);
    const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

    // Page state
    const [activeTab, setActiveTab] = useState<"mine" | "member" | "explore">("mine");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectFull | null>(null);

    // Form fields
    const [formTitle, setFormTitle] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formStage, setFormStage] = useState<"IDEA" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIEVED">("IDEA");
    const [formCategory, setFormCategory] = useState("");
    const [formTechStack, setFormTechStack] = useState("");
    const [formCommitment, setFormCommitment] = useState("");
    const [formVisibility, setFormVisibility] = useState<"PUBLIC" | "PRIVATE" | "MEMBER ONLY">("PUBLIC");
    const [formRequirements, setFormRequirements] = useState<{ title: string; description: string; role: string; skills: string; openings: number }[]>([]);

    // Application Form fields
    const [appCoverLetter, setAppCoverLetter] = useState("");
    const [appPortfolio, setAppPortfolio] = useState("");
    const [appGithub, setAppGithub] = useState("");
    const [appResume, setAppResume] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [owned, member, allRes, bookmarksRes] = await Promise.all([
                dashboardService.getMyOwnedProjects(),
                dashboardService.getMyMemberships(),
                api.get<{ success: boolean; data: { project: ProjectFull[] } }>("/api/v1/project"),
                dashboardService.getMyBookmarks()
            ]);
            setOwnedProjects(owned);
            setMemberships(member);
            setAllProjects(allRes.data?.data?.project ?? []);
            setBookmarkedIds(bookmarksRes.map(b => b.project?._id).filter(Boolean));
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Create handlers
    const openCreateModal = () => {
        setFormTitle("");
        setFormDesc("");
        setFormStage("IDEA");
        setFormCategory("");
        setFormTechStack("");
        setFormCommitment("");
        setFormVisibility("PUBLIC");
        setFormRequirements([]);
        setIsCreateOpen(true);
    };

    const addRequirementInput = () => {
        setFormRequirements(prev => [...prev, { title: "", description: "", role: "", skills: "", openings: 1 }]);
    };

    const removeRequirementInput = (index: number) => {
        setFormRequirements(prev => prev.filter((_, idx) => idx !== index));
    };

    const updateRequirementInput = (index: number, key: string, val: any) => {
        setFormRequirements(prev => prev.map((req, idx) => idx === index ? { ...req, [key]: val } : req));
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle.trim() || !formDesc.trim() || !formCategory.trim() || !formTechStack.trim()) {
            showToast("Please fill in all required fields.");
            return;
        }

        setActionLoading(true);
        try {
            const payload = {
                title: formTitle.trim(),
                description: formDesc.trim(),
                Stage: formStage,
                category: formCategory.trim(),
                techStack: formTechStack.split(",").map(t => t.trim()).filter(Boolean),
                visibility: formVisibility,
                commitment: formCommitment.trim() || undefined,
                Requiremnts: formRequirements.map(r => ({
                    title: r.title.trim(),
                    description: r.description.trim(),
                    role: r.role.trim(),
                    skills: r.skills.split(",").map(s => s.trim()).filter(Boolean),
                    openings: Number(r.openings) || 1
                })).filter(r => r.title && r.role)
            };

            const res = await api.post(ENDPOINT.projects.create, payload);
            if (res.data.success) {
                showToast("🎉 Project created successfully!");
                setIsCreateOpen(false);
                fetchData();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to create project.");
        } finally {
            setActionLoading(false);
        }
    };

    // Edit Handlers
    const openEditModal = (proj: ProjectFull) => {
        setSelectedProject(proj);
        setFormTitle(proj.title);
        setFormDesc(proj.description);
        setFormStage((proj.Stage as any) || "IDEA");
        setFormCategory(proj.category || "");
        setFormTechStack(proj.techStack?.join(", ") || "");
        setFormCommitment(proj.commitment || "");
        setFormVisibility((proj.visibility as any) || "PUBLIC");
        setFormRequirements(proj.Requiremnts?.map(r => ({
            title: r.title,
            description: r.description,
            role: r.role,
            skills: r.skills?.join(", ") || "",
            openings: r.openings
        })) || []);
        setIsDetailOpen(false);
        setIsEditOpen(true);
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;

        setActionLoading(true);
        try {
            const payload = {
                title: formTitle.trim(),
                description: formDesc.trim(),
                Stage: formStage,
                category: formCategory.trim(),
                techStack: formTechStack.split(",").map(t => t.trim()).filter(Boolean),
                visibility: formVisibility,
                commitment: formCommitment.trim() || undefined,
                Requiremnts: formRequirements.map(r => ({
                    title: r.title.trim(),
                    description: r.description.trim(),
                    role: r.role.trim(),
                    skills: r.skills.split(",").map(s => s.trim()).filter(Boolean),
                    openings: Number(r.openings) || 1
                })).filter(r => r.title && r.role)
            };

            const res = await api.put(ENDPOINT.projects.update(selectedProject._id), payload);
            if (res.data.success) {
                showToast("Project updated successfully!");
                setIsEditOpen(false);
                fetchData();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to update project.");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete and Archive Handlers
    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this project? This cannot be undone.")) return;

        setActionLoading(true);
        try {
            const res = await api.delete(ENDPOINT.projects.delete(projectId));
            if (res.data.success) {
                showToast("Project deleted successfully.");
                setIsDetailOpen(false);
                fetchData();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to delete project.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleArchiveProject = async (projectId: string) => {
        if (!window.confirm("Archive this project? It will be marked as archived and stage updated to ARCHIEVED.")) return;

        setActionLoading(true);
        try {
            const res = await api.patch(ENDPOINT.projects.archive(projectId));
            if (res.data.success) {
                showToast("Project archived successfully.");
                setIsDetailOpen(false);
                fetchData();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to archive project.");
        } finally {
            setActionLoading(false);
        }
    };

    // Bookmarks Toggle
    const handleBookmarkToggle = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        const isBookmarked = bookmarkedIds.includes(projectId);

        try {
            if (isBookmarked) {
                await api.delete(ENDPOINT.bookmarks.remove(projectId));
                setBookmarkedIds(prev => prev.filter(id => id !== projectId));
                showToast("Bookmark removed.");
            } else {
                await api.post(ENDPOINT.bookmarks.add(projectId));
                setBookmarkedIds(prev => [...prev, projectId]);
                showToast("Project bookmarked!");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to update bookmark.");
        }
    };

    // Apply Handlers
    const openApplyModal = (proj: ProjectFull) => {
        setSelectedProject(proj);
        setAppCoverLetter("");
        setAppPortfolio("");
        setAppGithub("");
        setAppResume("");
        setIsDetailOpen(false);
        setIsApplyOpen(true);
    };

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;

        setActionLoading(true);
        try {
            const payload = {
                coverLetter: appCoverLetter.trim() || undefined,
                portfolio: appPortfolio.trim() || undefined,
                github: appGithub.trim() || undefined,
                resume: appResume.trim() || undefined,
            };

            const res = await api.post(ENDPOINT.projects.apply(selectedProject._id), payload);
            if (res.data.success) {
                showToast("🎉 Application submitted successfully!");
                setIsApplyOpen(false);
                fetchData();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to submit application.");
        } finally {
            setActionLoading(false);
        }
    };

    const openProjectDetails = (proj: any) => {
        setSelectedProject(proj);
        setIsDetailOpen(true);
    };

    // Filters & Tabs
    const tabs = [
        { id: "mine", label: "My Projects", icon: Crown, count: ownedProjects.length },
        { id: "member", label: "Workspaces", icon: Users, count: memberships.length },
        { id: "explore", label: "Explore", icon: LayoutGrid, count: allProjects.length },
    ] as const;

    const projectsToShow =
        activeTab === "mine" ? ownedProjects :
        activeTab === "member" ? memberships :
        allProjects;

    const badgeLabel = activeTab === "mine" ? "Owner" : activeTab === "member" ? "Contributor" : "Open";
    const badgeStyle = activeTab === "mine"
        ? "bg-blue-50 text-blue-600 border-blue-100"
        : activeTab === "member"
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-zinc-50 text-zinc-600 border-zinc-200";

    const isMember = (projId: string) => {
        return ownedProjects.some(p => p._id === projId) || memberships.some(p => p._id === projId);
    };

    const isOwner = (projOwnerId: string) => {
        return (user?._id ?? user?.userId) === projOwnerId;
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 relative">
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

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight font-display text-zinc-950">Projects</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Manage your projects and workspaces</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer"
                >
                    <Plus size={15} />
                    New Project
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200 gap-1">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                            }`}
                        >
                            <Icon size={15} />
                            <span>{tab.label}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-400"
                            }`}>{tab.count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">Loading projects…</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <AlertCircle size={28} className="text-red-400" />
                    <p className="text-sm font-semibold text-zinc-600">{error}</p>
                </div>
            ) : projectsToShow.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border border-zinc-200/80 bg-white rounded-3xl gap-4">
                    <div className="w-14 h-14 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-center">
                        <Folder size={24} className="text-zinc-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-base font-bold text-zinc-950">No projects here yet</h3>
                        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                            {activeTab === "mine"
                                ? "Create your first project to start building with a team."
                                : activeTab === "member"
                                ? "Accept a project invitation to see your workspaces here."
                                : "No public projects found."}
                        </p>
                    </div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        {projectsToShow.map((proj) => {
                            const isBookmarked = bookmarkedIds.includes(proj._id);
                            return (
                                <div
                                    key={proj._id}
                                    onClick={() => openProjectDetails(proj)}
                                    className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer relative group/card"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                                            {badgeLabel}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {"Stage" in proj && proj.Stage && (
                                                <span className="text-[10px] text-zinc-400 font-mono capitalize">{proj.Stage.toLowerCase()}</span>
                                            )}
                                            {activeTab === "explore" && (
                                                <button
                                                    onClick={(e) => handleBookmarkToggle(e, proj._id)}
                                                    className="p-1 rounded-md text-zinc-400 hover:text-amber-500 transition-colors"
                                                >
                                                    <Star size={13} fill={isBookmarked ? "currentColor" : "none"} className={isBookmarked ? "text-amber-500" : ""} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-zinc-950 font-display">{proj.title}</h3>
                                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{proj.description}</p>
                                    </div>
                                    {"techStack" in proj && proj.techStack && proj.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {proj.techStack.slice(0, 4).map((t: string) => (
                                                <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-500 rounded">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-zinc-50 flex justify-between items-center">
                                        {"membersCount" in proj && (
                                            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                                                <Users size={12} />
                                                {proj.membersCount || 1} members
                                            </span>
                                        )}
                                        <span className="text-xs font-bold text-zinc-700 flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors">
                                            <span>{isMember(proj._id) ? "Workspace" : "Details"}</span>
                                            <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* CREATE PROJECT MODAL */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto flex flex-col space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <h2 className="text-lg font-black text-zinc-950 flex items-center gap-2">
                                    <Folder size={18} className="text-blue-600" />
                                    New Project
                                </h2>
                                <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-medium">
                                <div className="space-y-1">
                                    <label className="text-zinc-500">Project Title *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={50}
                                        value={formTitle}
                                        onChange={e => setFormTitle(e.target.value)}
                                        placeholder="e.g. peerY AI Platform"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Description *</label>
                                    <textarea
                                        required
                                        maxLength={500}
                                        rows={3}
                                        value={formDesc}
                                        onChange={e => setFormDesc(e.target.value)}
                                        placeholder="Brief summary of the goals, features, and audience..."
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Category *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formCategory}
                                            onChange={e => setFormCategory(e.target.value)}
                                            placeholder="e.g. Web, Mobile, AI"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Commitment</label>
                                        <input
                                            type="text"
                                            value={formCommitment}
                                            onChange={e => setFormCommitment(e.target.value)}
                                            placeholder="e.g. 10 hours/week"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Stage</label>
                                        <select
                                            value={formStage}
                                            onChange={e => setFormStage(e.target.value as any)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="IDEA">Idea</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="PAUSED">Paused</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Visibility</label>
                                        <select
                                            value={formVisibility}
                                            onChange={e => setFormVisibility(e.target.value as any)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="PUBLIC">Public</option>
                                            <option value="PRIVATE">Private</option>
                                            <option value="MEMBER ONLY">Members Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Tech Stack * (Comma separated)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formTechStack}
                                        onChange={e => setFormTechStack(e.target.value)}
                                        placeholder="React, TypeScript, Node.js, MongoDB"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* REQUIREMENTS BUILDER */}
                                <div className="space-y-2 pt-2 border-t border-zinc-100">
                                    <div className="flex justify-between items-center">
                                        <label className="text-zinc-800 font-bold flex items-center gap-1.5">
                                            <Briefcase size={14} className="text-blue-500" />
                                            Role Requirements
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addRequirementInput}
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-bold"
                                        >
                                            <Plus size={12} /> Add Role
                                        </button>
                                    </div>

                                    {formRequirements.length === 0 && (
                                        <p className="text-[10px] text-zinc-400 italic">No roles specified. Standard public requests can be added later.</p>
                                    )}

                                    <div className="space-y-3">
                                        {formRequirements.map((req, index) => (
                                            <div key={index} className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl relative space-y-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRequirementInput(index)}
                                                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
                                                >
                                                    <X size={12} />
                                                </button>

                                                <div className="grid grid-cols-2 gap-2.5">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Req Title (e.g. Backend Lead)"
                                                            required
                                                            value={req.title}
                                                            onChange={e => updateRequirementInput(index, "title", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Role (e.g. Node Developer, min 3 chars)"
                                                            required
                                                            value={req.role}
                                                            onChange={e => updateRequirementInput(index, "role", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Required Skills (Comma separated tags)"
                                                    value={req.skills}
                                                    onChange={e => updateRequirementInput(index, "skills", e.target.value)}
                                                    className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                />

                                                <div className="grid grid-cols-3 gap-2.5 items-center">
                                                    <div className="col-span-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Description (What they will do)"
                                                            required
                                                            value={req.description}
                                                            onChange={e => updateRequirementInput(index, "description", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={req.openings}
                                                            onChange={e => updateRequirementInput(index, "openings", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : "Create Project"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* EDIT PROJECT MODAL */}
            <AnimatePresence>
                {isEditOpen && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto flex flex-col space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <h2 className="text-lg font-black text-zinc-950 flex items-center gap-2">
                                    <Edit2 size={16} className="text-blue-600" />
                                    Edit Project: {selectedProject.title}
                                </h2>
                                <button onClick={() => setIsEditOpen(false)} className="p-1 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProject} className="space-y-4 text-xs font-medium">
                                <div className="space-y-1">
                                    <label className="text-zinc-500">Project Title *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={50}
                                        value={formTitle}
                                        onChange={e => setFormTitle(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Description *</label>
                                    <textarea
                                        required
                                        maxLength={500}
                                        rows={3}
                                        value={formDesc}
                                        onChange={e => setFormDesc(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Category *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formCategory}
                                            onChange={e => setFormCategory(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Commitment</label>
                                        <input
                                            type="text"
                                            value={formCommitment}
                                            onChange={e => setFormCommitment(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Stage</label>
                                        <select
                                            value={formStage}
                                            onChange={e => setFormStage(e.target.value as any)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="IDEA">Idea</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="PAUSED">Paused</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-zinc-500">Visibility</label>
                                        <select
                                            value={formVisibility}
                                            onChange={e => setFormVisibility(e.target.value as any)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="PUBLIC">Public</option>
                                            <option value="PRIVATE">Private</option>
                                            <option value="MEMBER ONLY">Members Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Tech Stack * (Comma separated)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formTechStack}
                                        onChange={e => setFormTechStack(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* REQUIREMENTS BUILDER */}
                                <div className="space-y-2 pt-2 border-t border-zinc-100">
                                    <div className="flex justify-between items-center">
                                        <label className="text-zinc-800 font-bold flex items-center gap-1.5">
                                            <Briefcase size={14} className="text-blue-500" />
                                            Role Requirements
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addRequirementInput}
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-bold"
                                        >
                                            <Plus size={12} /> Add Role
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {formRequirements.map((req, index) => (
                                            <div key={index} className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl relative space-y-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRequirementInput(index)}
                                                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
                                                >
                                                    <X size={12} />
                                                </button>

                                                <div className="grid grid-cols-2 gap-2.5">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Req Title (e.g. Backend Lead)"
                                                            required
                                                            value={req.title}
                                                            onChange={e => updateRequirementInput(index, "title", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Role (e.g. Node Developer, min 3 chars)"
                                                            required
                                                            value={req.role}
                                                            onChange={e => updateRequirementInput(index, "role", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Required Skills (Comma separated tags)"
                                                    value={req.skills}
                                                    onChange={e => updateRequirementInput(index, "skills", e.target.value)}
                                                    className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                />

                                                <div className="grid grid-cols-3 gap-2.5 items-center">
                                                    <div className="col-span-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Description (What they will do)"
                                                            required
                                                            value={req.description}
                                                            onChange={e => updateRequirementInput(index, "description", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={req.openings}
                                                            onChange={e => updateRequirementInput(index, "openings", e.target.value)}
                                                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PROJECT DETAIL MODAL */}
            <AnimatePresence>
                {isDetailOpen && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto flex flex-col space-y-4"
                        >
                            <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                                <div>
                                    <h2 className="text-lg font-black text-zinc-950 font-display">{selectedProject.title}</h2>
                                    <span className="text-[10px] bg-zinc-50 border border-zinc-200 font-mono text-zinc-500 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                                        {selectedProject.category || "General"} • {selectedProject.Stage?.toLowerCase()}
                                    </span>
                                </div>
                                <button onClick={() => setIsDetailOpen(false)} className="p-1 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-zinc-800">Description</h4>
                                    <p className="text-zinc-500 leading-relaxed text-[11px]">{selectedProject.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-50">
                                    <div>
                                        <span className="text-zinc-400 block">Commitment</span>
                                        <span className="font-bold text-zinc-800">{selectedProject.commitment || "flexible"}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400 block">Visibility</span>
                                        <span className="font-bold text-zinc-800 capitalize">{selectedProject.visibility?.toLowerCase()}</span>
                                    </div>
                                </div>

                                {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                                    <div className="space-y-1.5">
                                        <h4 className="font-bold text-zinc-800">Technologies</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedProject.techStack.map(t => (
                                                <span key={t} className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements List */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-zinc-800 flex items-center gap-1.5">
                                        <Briefcase size={13} className="text-blue-500" />
                                        Open Roles
                                    </h4>
                                    {!selectedProject.Requiremnts || selectedProject.Requiremnts.length === 0 ? (
                                        <p className="text-zinc-400 italic">No specific role openings listed.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedProject.Requiremnts.map((req, index) => (
                                                <div key={index} className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl space-y-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-zinc-900">{req.title}</span>
                                                        <span className="bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                                                            {req.openings} Openings
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-500 text-[10px]">{req.description}</p>
                                                    {req.skills && req.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 pt-1">
                                                            {req.skills.map(s => (
                                                                <span key={s} className="px-1.5 py-0.5 bg-white border border-zinc-200 text-[8px] font-bold text-zinc-400 rounded uppercase">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-zinc-100 flex items-center gap-2">
                                {isOwner(selectedProject.owner) ? (
                                    <>
                                        <button
                                            onClick={() => openEditModal(selectedProject)}
                                            className="px-4 py-2 border border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            <Edit2 size={13} /> Edit
                                        </button>
                                        {selectedProject.Stage !== "ARCHIEVED" && (
                                            <button
                                                onClick={() => handleArchiveProject(selectedProject._id)}
                                                className="px-4 py-2 border border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <Archive size={13} /> Archive
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteProject(selectedProject._id)}
                                            className="px-4 py-2 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                        <button
                                            onClick={() => navigate(`/project/${selectedProject._id}/workspace`)}
                                            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            Workspace <ExternalLink size={13} />
                                        </button>
                                    </>
                                ) : isMember(selectedProject._id) ? (
                                    <button
                                        onClick={() => navigate(`/project/${selectedProject._id}/workspace`)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                    >
                                        Go to Workspace <ExternalLink size={13} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openApplyModal(selectedProject)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                        <ClipboardList size={14} /> Apply to Join Project
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* APPLY TO PROJECT MODAL */}
            <AnimatePresence>
                {isApplyOpen && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-md p-6 flex flex-col space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
                                    <ClipboardList size={16} className="text-blue-600" />
                                    Apply to: {selectedProject.title}
                                </h2>
                                <button onClick={() => setIsApplyOpen(false)} className="p-1 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs font-medium">
                                <div className="space-y-1">
                                    <label className="text-zinc-500">Cover Letter / Introduction *</label>
                                    <textarea
                                        required
                                        maxLength={1000}
                                        rows={4}
                                        value={appCoverLetter}
                                        onChange={e => setAppCoverLetter(e.target.value)}
                                        placeholder="Explain why you are a good fit, what skills you bring, and your availability..."
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Portfolio URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={appPortfolio}
                                        onChange={e => setAppPortfolio(e.target.value)}
                                        placeholder="https://myportfolio.com"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">GitHub Profile URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={appGithub}
                                        onChange={e => setAppGithub(e.target.value)}
                                        placeholder="https://github.com/myusername"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Resume Link / Doc (Optional)</label>
                                    <input
                                        type="url"
                                        value={appResume}
                                        onChange={e => setAppResume(e.target.value)}
                                        placeholder="https://drive.google.com/resume"
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : "Submit Application"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
