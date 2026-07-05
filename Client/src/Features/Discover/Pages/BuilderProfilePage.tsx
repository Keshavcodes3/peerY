import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, MapPin, Clock, ExternalLink,
    Users, Star, GitFork, Rocket, MessageCircle,
    Bookmark, UserPlus, CheckCircle, Code2, Briefcase,
    Zap, Globe, ChevronRight, Loader2, X
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import discoverService from '../services/discover.service';
import type { PublicProfile, PublicProject } from '../types/discover.types';
import { api, ENDPOINT } from '../../../App/api';
import dashboardService, { type WorkspaceProject } from '../../Dashboard/services/dashboard.service';

const TABS = ['Overview', 'Projects', 'Experience'] as const;
type Tab = typeof TABS[number];

const STAGE_STYLES: Record<string, string> = {
    idea: 'bg-zinc-100 text-zinc-600',
    mvp: 'bg-amber-50 text-amber-700 border border-amber-200',
    beta: 'bg-blue-50 text-blue-700 border border-blue-200',
    live: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    active: 'bg-blue-50 text-blue-700 border border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    paused: 'bg-zinc-100 text-zinc-600',
};

const getRoleTitle = (exp?: string) => {
    if (!exp) return 'Builder';
    const normalized = exp.toLowerCase();
    if (normalized === 'beginner') return 'Beginner Developer';
    if (normalized === 'intermediate') return 'Intermediate Developer';
    if (normalized === 'god') return 'Lead Architect / God Mode';
    return exp.charAt(0).toUpperCase() + exp.slice(1);
};

const getBannerGradient = (name: string = '') => {
    const gradients = [
        'from-blue-600 via-indigo-500 to-violet-600',
        'from-rose-500 via-pink-500 to-orange-400',
        'from-zinc-700 via-zinc-600 to-slate-500',
        'from-emerald-500 via-teal-500 to-cyan-500',
        'from-violet-600 via-purple-500 to-fuchsia-500',
        'from-amber-500 via-orange-500 to-red-500'
    ];
    let score = 0;
    for (let i = 0; i < name.length; i++) {
        score += name.charCodeAt(i);
    }
    return gradients[score % gradients.length];
};

const getMatchPercentage = (id: string = '') => {
    let score = 0;
    for (let i = 0; i < id.length; i++) {
        score += id.charCodeAt(i);
    }
    return 70 + (score % 29); // 70 to 98%
};

const getGithubUrl = (socials?: string[]) => {
    return socials?.find(s => s.includes('github.com')) || 'https://github.com';
};

const getWebsiteUrl = (socials?: string[]) => {
    return socials?.find(s => !s.includes('github.com')) || '';
};

// Mini GitHub-style contribution heatmap (purely visual)
function ContributionHeatmap() {
    const weeks = 26;
    const days = 7;
    const levels = [0, 0, 1, 1, 2, 2, 3, 4]; // weighted toward active

    return (
        <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Code2 size={13} /> GitHub Activity
            </h4>
            <div className="flex gap-1">
                {Array.from({ length: weeks }).map((_, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                        {Array.from({ length: days }).map((_, di) => {
                            const level = levels[Math.floor(Math.random() * levels.length)];
                            return (
                                <div
                                    key={di}
                                    className={`w-3 h-3 rounded-sm ${level === 0 ? 'bg-zinc-100' :
                                            level === 1 ? 'bg-blue-200' :
                                                level === 2 ? 'bg-blue-400' :
                                                    level === 3 ? 'bg-blue-600' :
                                                        'bg-blue-800'
                                        }`}
                                    title={`${level} contributions`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-zinc-400">Less</span>
                {[0, 1, 2, 3, 4].map(l => (
                    <div key={l} className={`w-3 h-3 rounded-sm ${l === 0 ? 'bg-zinc-100' :
                            l === 1 ? 'bg-blue-200' :
                                l === 2 ? 'bg-blue-400' :
                                    l === 3 ? 'bg-blue-600' :
                                        'bg-blue-800'
                        }`} />
                ))}
                <span className="text-[10px] text-zinc-400">More</span>
            </div>
        </div>
    );
}

export default function BuilderProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const [bookmarked, setBookmarked] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

    // Live state
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [projects, setProjects] = useState<PublicProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Bookmarks and Outgoing invitations
    const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
    const [ownedProjects, setOwnedProjects] = useState<WorkspaceProject[]>([]);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [inviteRole, setInviteRole] = useState("MEMBER");
    const [inviteMessage, setInviteMessage] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        discoverService.getPublicProfile(id)
            .then(res => {
                setProfile(res.profile);
                setProjects(res.projects ?? []);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || err.message || 'Failed to load profile');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [bookmarksRes, ownedRes] = await Promise.all([
                    dashboardService.getMyBookmarks(),
                    dashboardService.getMyOwnedProjects()
                ]);
                setBookmarkedIds(bookmarksRes.map(b => b.project?._id).filter(Boolean));
                setOwnedProjects(ownedRes);
                if (ownedRes.length > 0) {
                    setSelectedProjectId(ownedRes[0]._id);
                }
            } catch (err) {
                console.error("Failed to load user bookmarks/projects:", err);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const res = await api.get<{ success: boolean; data: any[] }>(ENDPOINT.match.getAll);
                const matches = res.data.data ?? [];
                const targetAuthId = profile?.authId;
                if (targetAuthId) {
                    const hasMatch = matches.some((m: any) => 
                        ((m.userOne?._id === targetAuthId || m.userTwo?._id === targetAuthId) || 
                         (m.userOne === targetAuthId || m.userTwo === targetAuthId)) && m.accepted
                    );
                    setIsMatched(hasMatch);
                }
            } catch (err) {
                console.error("Failed to check connection status:", err);
            }
        };
        if (profile) {
            checkConnection();
        }
    }, [profile]);

    useEffect(() => {
        if (!profile) return;
        const saved = localStorage.getItem("peerY_bookmarked_profiles");
        const list = saved ? JSON.parse(saved) : [];
        setBookmarked(list.some((p: any) => p._id === profile._id));
    }, [profile]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
                <Loader2 size={36} className="animate-spin text-blue-600 mb-4" />
                <p className="text-zinc-500 text-sm font-semibold">Loading builder profile…</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center p-8 bg-white border border-zinc-100 rounded-3xl shadow-sm max-w-sm">
                    <p className="text-red-500 font-bold mb-4">{error || 'Builder not found'}</p>
                    <button onClick={() => navigate('/discover')} className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1.5 justify-center mx-auto">
                        <ArrowLeft size={16} /> Back to Discover
                    </button>
                </div>
            </div>
        );
    }

    const matchPercentage = getMatchPercentage(profile._id);
    const matchColor =
        matchPercentage >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
            matchPercentage >= 75 ? 'text-blue-600 bg-blue-50 border-blue-200' :
                'text-amber-600 bg-amber-50 border-amber-200';

    const avatarUrl = profile.avatar || `https://i.pravatar.cc/300?u=${profile.authId}`;
    const bannerGradient = getBannerGradient(profile.name);
    const roleTitle = getRoleTitle(profile.experience);
    const locationStr = profile.college ? profile.college : 'Remote';
    const availabilityStr = profile.avaliabilty ? 'Available · 15h/week' : 'Busy';
    const followersCount = profile.followerCount || 0;
    const githubUrl = getGithubUrl(profile.socials);
    const websiteUrl = getWebsiteUrl(profile.socials);
    const techStack = profile.techstack?.length && profile.techstack[0] !== "" ? profile.techstack : (profile.skills || []);

    const currentlyBuilding = projects.length > 0
        ? `Currently building: ${projects[0].title} — ${projects[0].description}`
        : 'Exploring new ideas to build';

    const lookingFor = profile.intent || 'Collaborating with developers to learn and build real-world products';
    const openRoles = projects.flatMap(p => p.Requiremnts?.map(r => r.role) || []);
    const tags = [
        profile.Rank ? `Rank ${profile.Rank}` : null,
        profile.experience ? `${profile.experience} developer` : null,
    ].filter(Boolean) as string[];

    // Bookmark Toggle for Project Card
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

    // Connect Action (triggers match request on backend discover/like)
    const handleConnectToggle = async () => {
        try {
            await api.post(ENDPOINT.match.like(profile.authId));
            setConnected(true);
            showToast("Connection request sent! 🎉");
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to send connection request.");
        }
    };

    // Send Invite Action
    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectId) {
            showToast("Please select a project.");
            return;
        }

        setIsInviting(true);
        try {
            const res = await api.post(ENDPOINT.invitations.send(selectedProjectId), {
                invitedUser: profile.authId,
                role: inviteRole,
                message: inviteMessage.trim() || undefined
            });
            if (res.data.success) {
                showToast("🎉 Invitation sent successfully!");
                setIsInviteOpen(false);
                setInviteMessage("");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to send invitation.");
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans relative">
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

            {/* Back bar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
                    <motion.button
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back to Discover
                    </motion.button>
                    <div className="flex-1" />
                    <span className="text-sm text-zinc-400 font-medium">{profile.name}</span>
                    <ChevronRight size={14} className="text-zinc-300" />
                    <span className="text-sm text-zinc-500 font-medium">Profile</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pb-20">

                {/* Hero Banner */}
                <div className="relative mt-6 rounded-[28px] overflow-hidden">
                    {/* Gradient banner */}
                    <div className={`h-52 bg-gradient-to-br ${bannerGradient} relative`}>
                        <div className="absolute inset-0 grid-bg opacity-20" />
                        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />

                        {/* Tags on banner */}
                        {tags.map(tag => (
                            <span key={tag} className="absolute top-5 left-5 inline-flex first:static last:ml-2 px-3 py-1.5 rounded-full glass text-[11px] font-semibold text-white/90 mr-2 capitalize">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* White card below banner */}
                    <div className="bg-white px-8 pt-0 pb-8 rounded-b-[28px] shadow-sm border border-zinc-100">

                        {/* Avatar row */}
                        <div className="flex items-end justify-between -mt-12 mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-[20px] ring-4 ring-white shadow-xl overflow-hidden bg-zinc-100">
                                    <img src={avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white">
                                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-status-ping opacity-60" />
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex items-center gap-2.5 pb-1">
                                {/* Bookmark */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        const saved = localStorage.getItem("peerY_bookmarked_profiles");
                                        let list = saved ? JSON.parse(saved) : [];
                                        if (bookmarked) {
                                            list = list.filter((p: any) => p._id !== profile?._id);
                                            showToast("Builder unbookmarked.");
                                        } else {
                                            list.push({
                                                _id: profile?._id,
                                                authId: profile?.authId,
                                                name: profile?.name,
                                                avatar: profile?.avatar,
                                                experience: profile?.experience,
                                                skills: profile?.skills || [],
                                                techstack: profile?.techstack || []
                                            });
                                            showToast("Builder bookmarked!");
                                        }
                                        localStorage.setItem("peerY_bookmarked_profiles", JSON.stringify(list));
                                        setBookmarked(!bookmarked);
                                    }}
                                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${bookmarked ? 'border-amber-400 bg-amber-50 text-amber-500' : 'border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700'
                                        }`}
                                >
                                    <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
                                </motion.button>

                                {/* Invite to build */}
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        if (ownedProjects.length === 0) {
                                            showToast("You must own at least one project to invite others.");
                                        } else {
                                            setIsInviteOpen(true);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-zinc-900 text-zinc-900 rounded-xl font-semibold text-sm hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                                >
                                    <Rocket size={15} />
                                    Invite to Build
                                </motion.button>

                                {/* Connect */}
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleConnectToggle}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer ${connected
                                            ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.2)]'
                                        }`}
                                >
                                    {connected ? <CheckCircle size={15} /> : <UserPlus size={15} />}
                                    {connected ? 'Connected' : 'Connect'}
                                </motion.button>
                            </div>
                        </div>

                        {/* Name + details */}
                        <div className="mb-4">
                            <div className="flex items-start justify-between flex-wrap gap-3">
                                <div>
                                    <h1 className="font-display text-3xl font-bold text-zinc-900 tracking-tight capitalize">{profile.name}</h1>
                                    <p className="text-blue-600 font-semibold mt-0.5">{roleTitle}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-zinc-500">
                                        <span className="flex items-center gap-1.5 capitalize"><MapPin size={13} /> {locationStr}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={13} /> {availabilityStr}</span>
                                        {profile.experience && (
                                            <span className="flex items-center gap-1.5 capitalize"><Briefcase size={13} /> {profile.experience} exp</span>
                                        )}
                                        <span className="flex items-center gap-1.5"><Users size={13} /> {followersCount.toLocaleString()} followers</span>
                                    </div>
                                </div>

                                {/* Match score card */}
                                <div className={`flex flex-col items-center px-5 py-3 rounded-2xl border-2 ${matchColor} shrink-0`}>
                                    <span className="text-3xl font-display font-black">{matchPercentage}%</span>
                                    <span className="text-xs font-bold uppercase tracking-widest mt-0.5">Match Score</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-3 mt-3">
                                <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                                    <FaGithub size={14} /> GitHub <ExternalLink size={10} />
                                </a>
                                {websiteUrl && (
                                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                                        <Globe size={14} /> Website <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 flex items-center gap-1 bg-white rounded-xl border border-zinc-100 p-1 shadow-sm w-fit">
                    {TABS.map(tab => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="tab-active"
                                    className="absolute inset-0 bg-zinc-900 rounded-lg"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className={`relative z-10 ${activeTab === tab ? 'text-white' : ''}`}>{tab}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6"
                    >
                        {/* OVERVIEW TAB */}
                        {activeTab === 'Overview' && (
                            <div className="grid grid-cols-3 gap-6">
                                {/* Left column */}
                                <div className="col-span-2 space-y-6">
                                    {/* About */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">About</h3>
                                        <p className="text-zinc-700 leading-relaxed">{profile.Bio || "Let's build something awesome."}</p>
                                    </div>

                                    {/* Currently Building */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Rocket size={13} /> Currently Building
                                        </h3>
                                        <p className="text-zinc-800 font-medium capitalize">{currentlyBuilding}</p>
                                    </div>

                                    {/* Looking For */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Looking For</h3>
                                        <p className="text-zinc-700 capitalize">{lookingFor}</p>
                                        {openRoles.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {openRoles.map((role, idx) => (
                                                    <span key={`${role}-${idx}`} className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold capitalize">
                                                        Hiring: {role}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* GitHub Heatmap */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm overflow-x-auto">
                                        <ContributionHeatmap />
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="space-y-6">
                                    {/* Tech Stack */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Zap size={13} className="text-blue-500" /> Tech Stack
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {techStack.map(tech => (
                                                <span key={tech} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 capitalize">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills as interests */}
                                    {profile.skills && profile.skills.length > 0 && (
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Interests</h3>
                                            <div className="space-y-2">
                                                {profile.skills.map(i => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-700 capitalize">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        {i}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Start conversation */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            if (isMatched) {
                                                navigate('/messages');
                                            } else {
                                                setIsConnectionModalOpen(true);
                                            }
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-semibold text-sm shadow-lg transition-colors cursor-pointer"
                                    >
                                        <MessageCircle size={16} />
                                        Start Conversation
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'Projects' && (
                            <div className="grid grid-cols-2 gap-5">
                                {projects.map(project => {
                                    const stageKey = project.Stage.toLowerCase();
                                    const isProjBookmarked = bookmarkedIds.includes(project._id);
                                    return (
                                        <motion.div
                                            key={project._id}
                                            whileHover={{ y: -2 }}
                                            className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative group/project"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm capitalize">
                                                    {project.title[0]}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STAGE_STYLES[stageKey] || STAGE_STYLES.idea}`}>
                                                        {project.Stage}
                                                    </span>
                                                    <button
                                                        onClick={(e) => handleBookmarkToggle(e, project._id)}
                                                        className="p-1 rounded-md text-zinc-400 hover:text-amber-500 transition-colors"
                                                    >
                                                        <Star size={13} fill={isProjBookmarked ? "currentColor" : "none"} className={isProjBookmarked ? "text-amber-500" : ""} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-display font-bold text-lg text-zinc-900 mb-1 capitalize">{project.title}</h3>
                                            <p className="text-sm text-zinc-500 leading-relaxed mb-4 capitalize">{project.description}</p>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {project.techStack.map(tech => (
                                                    <span key={tech} className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-600 capitalize">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-100">
                                                <span className="flex items-center gap-1"><Star size={12} /> {project.bookMarksCount}</span>
                                                <span className="flex items-center gap-1"><GitFork size={12} /> {project.membersCount} contributors</span>
                                                {project.Requiremnts && project.Requiremnts.length > 0 && (
                                                    <span className="ml-auto text-blue-600 font-semibold text-[11px]">
                                                        {project.Requiremnts.length} open role{project.Requiremnts.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {projects.length === 0 && (
                                    <div className="col-span-2 flex flex-col items-center justify-center py-20 text-zinc-400">
                                        <Rocket size={32} className="mb-3 opacity-40" />
                                        <p className="font-medium">No projects yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* EXPERIENCE TAB */}
                        {activeTab === 'Experience' && (
                            <div className="max-w-2xl space-y-4">
                                {[
                                    { title: roleTitle, company: 'Freelance / Open Source', duration: profile.experience ? `${profile.experience} level` : '3+ years', current: true },
                                    { title: 'Junior Developer', company: 'Tech Startup', duration: '2 years', current: false },
                                    { title: 'CS Degree', company: 'University', duration: '4 years', current: false },
                                ].map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm flex gap-4"
                                    >
                                        <div className="shrink-0 mt-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${exp.current ? 'bg-blue-600' : 'bg-zinc-100'}`}>
                                                <Briefcase size={17} className={exp.current ? 'text-white' : 'text-zinc-500'} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-zinc-900 capitalize">{exp.title}</h3>
                                                {exp.current && (
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold">Current</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-500 mt-0.5 capitalize">{exp.company}</p>
                                            <p className="text-xs text-zinc-400 mt-1 font-medium capitalize">{exp.duration}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* INVITE TO BUILD MODAL */}
            <AnimatePresence>
                {isInviteOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-md p-6 flex flex-col space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
                                    <Rocket size={16} className="text-blue-600" />
                                    Invite to Build
                                </h2>
                                <button onClick={() => setIsInviteOpen(false)} className="p-1 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSendInvite} className="space-y-4 text-xs font-medium">
                                <div className="space-y-1">
                                    <label className="text-zinc-500">Select Project *</label>
                                    <select
                                        value={selectedProjectId}
                                        onChange={e => setSelectedProjectId(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    >
                                        {ownedProjects.map(p => (
                                            <option key={p._id} value={p._id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Suggested Role *</label>
                                    <select
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="MEMBER">Member</option>
                                        <option value="MAINTAINER">Maintainer</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="VIEWER">Viewer</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-zinc-500">Invitation Message</label>
                                    <textarea
                                        maxLength={500}
                                        rows={3}
                                        value={inviteMessage}
                                        onChange={e => setInviteMessage(e.target.value)}
                                        placeholder={`Hi ${profile.name}, we would love to have you join our project to collaborate on...`}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {isInviting ? <Loader2 size={14} className="animate-spin" /> : "Send Invitation"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CONNECTION REQUIRED MODAL */}
            <AnimatePresence>
                {isConnectionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 shadow-2xl rounded-3xl w-full max-w-sm p-6 flex flex-col space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
                                    <MessageCircle size={16} className="text-blue-600" />
                                    Connection Required
                                </h2>
                                <button onClick={() => setIsConnectionModalOpen(false)} className="p-1 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-650 cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                                You need to be connected with @{profile.name} before starting a conversation. Send a connection request to match and unlock chat access!
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsConnectionModalOpen(false)}
                                    className="flex-1 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-bold py-2.5 rounded-xl transition-colors text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setIsConnectionModalOpen(false);
                                        handleConnectToggle();
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors text-xs cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <UserPlus size={13} />
                                    Connect Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
