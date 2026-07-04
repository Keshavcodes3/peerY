import { motion, AnimatePresence } from 'framer-motion';
import { type BuilderProfile } from '../data/mockData';
import LiveActivity from './LiveActivity';
import { MessageSquare, ArrowRight, Folder, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RightPanelProps {
    matches: BuilderProfile[];
}

const PROJECT_INVITES = [
    { id: 'pi1', name: 'AI Resume Analyzer', from: 'Neha G.', role: 'Frontend Dev', avatar: 'https://i.pravatar.cc/40?u=neha' },
    { id: 'pi2', name: 'PixelHabit',          from: 'Sarah J.', role: 'Backend Dev',  avatar: 'https://i.pravatar.cc/40?u=sarah' },
];

export default function RightPanel({ matches }: RightPanelProps) {
    const navigate = useNavigate();

    return (
        <aside className="w-72 h-full flex flex-col border-l border-zinc-100 bg-white/95 backdrop-blur-sm shrink-0 overflow-y-auto no-scrollbar">

            {/* Recent Matches */}
            <section className="px-5 pt-7">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-blue-500" />
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Matches</h3>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-blue-600 rounded-full px-2 py-0.5">
                        {matches.length}
                    </span>
                </div>

                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {matches.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center mb-3">
                                    <MessageSquare size={14} className="text-zinc-400" />
                                </div>
                                <p className="text-xs text-zinc-400 max-w-[140px] leading-relaxed">
                                    Keep swiping to find your next co-builder
                                </p>
                            </motion.div>
                        ) : (
                            matches.slice(0, 5).map((match) => (
                                <motion.div
                                    key={match.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    onClick={() => navigate(`/discover/${match.id}`)}
                                    className="group flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer"
                                >
                                    <div className="relative">
                                        <img
                                            src={match.avatarUrl}
                                            alt={match.name}
                                            className="w-9 h-9 rounded-xl object-cover"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-semibold text-zinc-900 truncate">{match.name}</h4>
                                        <p className="text-[11px] text-zinc-500 truncate">{match.role}</p>
                                    </div>
                                    <button className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm shrink-0">
                                        <ArrowRight size={12} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Divider */}
            <div className="mx-5 my-5 h-px bg-zinc-100" />

            {/* Project Invitations */}
            <section className="px-5">
                <div className="flex items-center gap-2 mb-4">
                    <Folder size={14} className="text-violet-500" />
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Invitations</h3>
                </div>
                <div className="space-y-2">
                    {PROJECT_INVITES.map(invite => (
                        <motion.div
                            key={invite.id}
                            whileHover={{ x: 2 }}
                            className="p-3 rounded-xl border border-zinc-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <img src={invite.avatar} alt={invite.from} className="w-6 h-6 rounded-full" />
                                <span className="text-[11px] font-semibold text-zinc-700">{invite.from}</span>
                                <span className="text-[10px] text-zinc-400">wants you as</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-zinc-900">{invite.name}</p>
                                    <p className="text-[10px] text-violet-600 font-semibold mt-0.5">{invite.role}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    <button className="px-2 py-1 text-[10px] font-bold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                                        Accept
                                    </button>
                                    <button className="px-2 py-1 text-[10px] font-bold bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors">
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="mx-5 my-5 h-px bg-zinc-100" />

            {/* Live Activity */}
            <section className="flex-1">
                <LiveActivity />
            </section>
        </aside>
    );
}
