import { type BuilderProfile } from '../data/mockData';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveActivity from './LiveActivity';

interface MatchQueueProps {
    matches: BuilderProfile[];
}

export default function MatchQueue({ matches }: MatchQueueProps) {
    return (
        <div className="h-full flex flex-col border-l border-zinc-100 bg-white">
            <div className="p-6 pb-2 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900 tracking-wide uppercase flex justify-between items-center">
                    New Matches
                    <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">{matches.length}</span>
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                    {matches.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-32 flex flex-col items-center justify-center text-center px-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center mb-3">
                                <MessageSquare size={16} className="text-zinc-400" />
                            </div>
                            <p className="text-sm text-zinc-500">Keep swiping to find your next co-builder.</p>
                        </motion.div>
                    ) : (
                        matches.map((match) => (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group p-3 rounded-2xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center gap-3"
                            >
                                <img src={match.avatarUrl} alt={match.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-zinc-900 truncate">{match.name}</h4>
                                    <p className="text-xs text-zinc-500 truncate">{match.role}</p>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm">
                                    <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Live Activity Section */}
            <div className="border-t border-zinc-100">
                <LiveActivity />
            </div>
        </div>
    );
}
