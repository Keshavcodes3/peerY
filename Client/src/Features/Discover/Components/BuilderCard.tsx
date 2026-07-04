import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { type BuilderProfile } from '../data/mockData';
import { MapPin, Clock, Rocket, Search, ExternalLink, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BuilderCardProps {
    profile: BuilderProfile;
    isTop?: boolean;
}

export default function BuilderCard({ profile, isTop = false }: BuilderCardProps) {
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D tilt via mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isTop || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const matchColor =
        profile.matchPercentage >= 90 ? 'text-emerald-500' :
        profile.matchPercentage >= 75 ? 'text-blue-500' :
        'text-amber-500';

    const matchRing =
        profile.matchPercentage >= 90 ? 'ring-emerald-400/40' :
        profile.matchPercentage >= 75 ? 'ring-blue-400/40' :
        'ring-amber-400/40';

    return (
        <motion.div
            ref={cardRef}
            className="w-full h-full perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={isTop ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : {}}
        >
            <div className="w-full h-full bg-white rounded-[28px] overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.14)] border border-zinc-100/80 flex flex-col select-none relative">

                {/* Banner / Hero image area */}
                <div className={`relative h-48 bg-gradient-to-br ${profile.bannerGradient} shrink-0 overflow-hidden`}>
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 grid-bg opacity-20" />

                    {/* Ambient orbs */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                    {/* Match score — top right */}
                    <div className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass animate-pulse-glow ring-2 ${matchRing}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span className={`text-xs font-bold ${matchColor}`}>{profile.matchPercentage}% Match</span>
                    </div>

                    {/* Tags — top left */}
                    {profile.tags && profile.tags.length > 0 && (
                        <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                            {profile.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2.5 py-1 rounded-full glass text-[10px] font-semibold text-white/90">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Avatar — bottom center, overlapping */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-zinc-100">
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                    draggable="false"
                                />
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white">
                                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-status-ping opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar pt-12 px-6 pb-6 space-y-5">

                    {/* Name + role */}
                    <div className="text-center">
                        <h2 className="text-2xl font-display font-bold text-zinc-900 tracking-tight">{profile.name}</h2>
                        <p className="text-sm font-semibold text-blue-600 mt-0.5">{profile.role}</p>
                        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-zinc-400 font-medium">
                            <span className="flex items-center gap-1"><MapPin size={11} /> {profile.location}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-300" />
                            <span className="flex items-center gap-1"><Clock size={11} /> {profile.availability}</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-zinc-500 text-[13px] leading-relaxed text-center line-clamp-2">{profile.bio}</p>

                    {/* Divider */}
                    <div className="w-full h-px bg-zinc-100" />

                    {/* Tech Stack */}
                    <div>
                        <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
                            <Zap size={12} className="text-blue-500" /> Stack
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {profile.stack.map(tech => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Currently Building */}
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 p-4">
                        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Rocket size={12} /> Currently Building
                        </h4>
                        <p className="text-zinc-800 text-[13px] font-medium leading-snug">{profile.building}</p>
                    </div>

                    {/* Looking For */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200/60 p-4">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Search size={12} /> Looking For
                        </h4>
                        <p className="text-zinc-700 text-[13px] font-medium leading-snug">{profile.lookingFor}</p>
                    </div>

                    {/* Open roles */}
                    {profile.openRoles && profile.openRoles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {profile.openRoles.map(role => (
                                <span key={role} className="px-3 py-1 bg-blue-600 text-white rounded-full text-[11px] font-semibold">
                                    Hiring: {role}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center justify-between pt-1">
                        {profile.followers && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Users size={12} />
                                <span className="font-semibold text-zinc-700">{profile.followers.toLocaleString()}</span> followers
                            </div>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/discover/${profile.id}`); }}
                            className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            View Profile <ExternalLink size={10} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
