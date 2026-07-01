import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBuilders } from '../data/mockData';
import {
    ArrowLeft, MapPin, Clock, ExternalLink,
    Users, Star, GitFork, Rocket, MessageCircle,
    Bookmark, UserPlus, CheckCircle, Code2, Briefcase,
    Zap, Globe, ChevronRight
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa'

const TABS = ['Overview', 'Projects', 'Experience'] as const;
type Tab = typeof TABS[number];

const STAGE_STYLES: Record<string, string> = {
    idea: 'bg-zinc-100 text-zinc-600',
    mvp: 'bg-amber-50 text-amber-700 border border-amber-200',
    beta: 'bg-blue-50 text-blue-700 border border-blue-200',
    live: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
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

    const profile = mockBuilders.find(b => b.id === id);

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <p className="text-zinc-500 mb-4">Builder not found</p>
                    <button onClick={() => navigate('/discover')} className="text-blue-600 font-semibold">
                        ← Back to Discover
                    </button>
                </div>
            </div>
        );
    }

    const matchColor =
        profile.matchPercentage >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
            profile.matchPercentage >= 75 ? 'text-blue-600 bg-blue-50 border-blue-200' :
                'text-amber-600 bg-amber-50 border-amber-200';

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">

            {/* Back bar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
                    <motion.button
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
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
                    <div className={`h-52 bg-gradient-to-br ${profile.bannerGradient} relative`}>
                        <div className="absolute inset-0 grid-bg opacity-20" />
                        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />

                        {/* Tags on banner */}
                        {profile.tags?.map(tag => (
                            <span key={tag} className="absolute top-5 left-5 inline-flex first:static last:ml-2 px-3 py-1.5 rounded-full glass text-[11px] font-semibold text-white/90 mr-2">
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
                                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
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
                                    onClick={() => setBookmarked(b => !b)}
                                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${bookmarked ? 'border-amber-400 bg-amber-50 text-amber-500' : 'border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700'
                                        }`}
                                >
                                    <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
                                </motion.button>

                                {/* Invite to build */}
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-zinc-900 text-zinc-900 rounded-xl font-semibold text-sm hover:bg-zinc-900 hover:text-white transition-all"
                                >
                                    <Rocket size={15} />
                                    Invite to Build
                                </motion.button>

                                {/* Connect */}
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setConnected(c => !c)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${connected
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
                                    <h1 className="font-display text-3xl font-bold text-zinc-900 tracking-tight">{profile.name}</h1>
                                    <p className="text-blue-600 font-semibold mt-0.5">{profile.role}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-zinc-500">
                                        <span className="flex items-center gap-1.5"><MapPin size={13} /> {profile.location}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={13} /> {profile.availability}</span>
                                        {profile.experience && (
                                            <span className="flex items-center gap-1.5"><Briefcase size={13} /> {profile.experience} exp</span>
                                        )}
                                        {profile.followers && (
                                            <span className="flex items-center gap-1.5"><Users size={13} /> {profile.followers.toLocaleString()} followers</span>
                                        )}
                                    </div>
                                </div>

                                {/* Match score card */}
                                <div className={`flex flex-col items-center px-5 py-3 rounded-2xl border-2 ${matchColor} shrink-0`}>
                                    <span className="text-3xl font-display font-black">{profile.matchPercentage}%</span>
                                    <span className="text-xs font-bold uppercase tracking-widest mt-0.5">Match Score</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-3 mt-3">
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                                        <FaGithub size={14} /> GitHub <ExternalLink size={10} />
                                    </a>
                                )}
                                {profile.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer"
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
                            className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
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
                                        <p className="text-zinc-700 leading-relaxed">{profile.bio}</p>
                                    </div>

                                    {/* Currently Building */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Rocket size={13} /> Currently Building
                                        </h3>
                                        <p className="text-zinc-800 font-medium">{profile.building}</p>
                                    </div>

                                    {/* Looking For */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Looking For</h3>
                                        <p className="text-zinc-700">{profile.lookingFor}</p>
                                        {profile.openRoles && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {profile.openRoles.map(role => (
                                                    <span key={role} className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold">
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
                                            {profile.stack.map(tech => (
                                                <span key={tech} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shared interests */}
                                    {profile.sharedInterests && (
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Interests</h3>
                                            <div className="space-y-2">
                                                {profile.sharedInterests.map(i => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-700">
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
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-semibold text-sm shadow-lg transition-colors"
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
                                {(profile.projects ?? []).map(project => (
                                    <motion.div
                                        key={project.id}
                                        whileHover={{ y: -2, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                        className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                {project.name[0]}
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STAGE_STYLES[project.stage]}`}>
                                                {project.stage}
                                            </span>
                                        </div>
                                        <h3 className="font-display font-bold text-lg text-zinc-900 mb-1">{project.name}</h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.stack.map(tech => (
                                                <span key={tech} className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-600">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-100">
                                            <span className="flex items-center gap-1"><Star size={12} /> {project.stars}</span>
                                            <span className="flex items-center gap-1"><GitFork size={12} /> {project.contributors} contributors</span>
                                            {project.openRoles && project.openRoles.length > 0 && (
                                                <span className="ml-auto text-blue-600 font-semibold text-[11px]">
                                                    {project.openRoles.length} open role{project.openRoles.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {(!profile.projects || profile.projects.length === 0) && (
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
                                    { title: profile.role, company: 'Freelance / Open Source', duration: profile.experience ?? '3+ years', current: true },
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
                                                <h3 className="font-semibold text-zinc-900">{exp.title}</h3>
                                                {exp.current && (
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold">Current</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-500 mt-0.5">{exp.company}</p>
                                            <p className="text-xs text-zinc-400 mt-1 font-medium">{exp.duration}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
