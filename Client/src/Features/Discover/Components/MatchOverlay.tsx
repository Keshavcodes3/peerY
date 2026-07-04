import { motion, AnimatePresence } from 'framer-motion';
import { type BuilderProfile } from '../data/mockData';
import { MessageCircle, User, X, Handshake, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchOverlayProps {
    isOpen: boolean;
    profile: BuilderProfile | null;
    onClose: () => void;
}

export default function MatchOverlay({ isOpen, profile, onClose }: MatchOverlayProps) {
    const navigate = useNavigate();
    if (!profile) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
                    />

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-blue-400/40"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale:   [0, 1, 0],
                                x: (Math.random() - 0.5) * 400,
                                y: (Math.random() - 0.5) * 400,
                            }}
                            transition={{ delay: i * 0.1, duration: 1.5, ease: 'easeOut' }}
                        />
                    ))}

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.25)]"
                    >
                        {/* Top gradient banner */}
                        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                        <div className="p-8">
                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-center mb-8"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 mb-4">
                                    <Handshake size={24} className="text-blue-600" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-zinc-900 mb-1.5">
                                    Potential Builder Match
                                </h2>
                                <p className="text-zinc-500 text-sm">
                                    You and <span className="font-semibold text-zinc-700">{profile.name}</span> share the same builder DNA.
                                </p>
                            </motion.div>

                            {/* Avatar connection */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15 }}
                                className="flex items-center justify-center gap-4 mb-8"
                            >
                                {/* You */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-2xl ring-4 ring-blue-100 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        Y
                                    </div>
                                    <span className="text-[11px] font-semibold text-zinc-500">You</span>
                                </div>

                                {/* Connection animation */}
                                <div className="flex flex-col items-center gap-1.5">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center"
                                    >
                                        <Sparkles size={18} className="text-blue-500" />
                                    </motion.div>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Match</span>
                                </div>

                                {/* Matched builder */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-2xl ring-4 ring-blue-100 overflow-hidden shadow-lg">
                                        <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-zinc-500">{profile.name.split(' ')[0]}</span>
                                </div>
                            </motion.div>

                            {/* Shared interests */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 mb-6"
                            >
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 text-center">
                                    You both share
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {(profile.sharedInterests ?? ['Building Products', 'Open Source']).map(interest => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 shadow-sm"
                                        >
                                            • {interest}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-zinc-500 mt-4 font-medium">
                                    Looks like you should talk. 💬
                                </p>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="space-y-3"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
                                >
                                    <MessageCircle size={17} />
                                    Start Conversation
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { onClose(); navigate(`/discover/${profile.id}`); }}
                                    className="w-full py-3.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <User size={17} />
                                    View Full Profile
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
