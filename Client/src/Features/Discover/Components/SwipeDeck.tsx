import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { type BuilderProfile } from '../data/mockData';
import BuilderCard from './BuilderCard';
import SwipeControls from './SwipeControls';
import { useSwipeDeck } from '../hooks/useSwipeDeck';
import { RotateCcw, Keyboard } from 'lucide-react';

interface SwipeDeckProps {
    profiles: BuilderProfile[];
    onMatch: (profile: BuilderProfile) => void;
}

export default function SwipeDeck({ profiles, onMatch }: SwipeDeckProps) {
    const { stack, x, handleSwipe, resetStack, isAnimating } = useSwipeDeck(profiles, onMatch);

    const rotation = useTransform(x, [-200, 200], [-12, 12]);
    const passOpacity = useTransform(x, [-120, -60, 0], [1, 0.4, 0]);
    const buildOpacity = useTransform(x, [0, 60, 120], [0, 0.4, 1]);

    // Background card parallax
    const bgScale   = useTransform(x, [-300, 0, 300], [1, 0.94, 1]);
    const bgOpacity = useTransform(x, [-300, 0, 300], [1, 0.6, 1]);
    const bg2Scale  = useTransform(x, [-300, 0, 300], [1, 0.89, 1]);
    const bg2Opacity= useTransform(x, [-300, 0, 300], [1, 0.35, 1]);

    if (stack.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[420px] flex flex-col items-center"
            >
                <div className="w-full aspect-[3/4.2] flex flex-col items-center justify-center bg-white rounded-[28px] border-2 border-dashed border-zinc-200 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-5 text-2xl">
                        👀
                    </div>
                    <h3 className="text-xl font-display font-bold text-zinc-900 mb-2">You've seen everyone!</h3>
                    <p className="text-sm text-zinc-500 text-center max-w-[220px] leading-relaxed mb-8">
                        More builders are joining every day. Check back soon.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={resetStack}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-sm font-semibold shadow-lg hover:bg-zinc-800 transition-colors"
                    >
                        <RotateCcw size={15} />
                        Reload Stack
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-[420px] flex flex-col items-center">

            {/* Card counter */}
            <div className="flex items-center gap-1.5 mb-4 text-xs text-zinc-400 font-medium">
                <span className="font-bold text-zinc-700">{stack.length}</span> builders remaining
            </div>

            {/* Card Stack */}
            <div className="relative w-full" style={{ aspectRatio: '3/4.2' }}>
                <AnimatePresence>
                    {stack.map((profile, index) => {
                        const isTop    = index === 0;
                        const isSecond = index === 1;

                        if (index > 2) return null;

                        // Stacked positioning offsets
                        const stackOffset = index * 8;

                        return (
                            <motion.div
                                key={profile.id}
                                className="absolute inset-0"
                                style={{
                                    x: isTop ? x : 0,
                                    rotate: isTop ? rotation : 0,
                                    scale:   isTop ? 1 : isSecond ? bgScale   : bg2Scale,
                                    opacity: isTop ? 1 : isSecond ? bgOpacity : bg2Opacity,
                                    zIndex:  10 - index,
                                    top: isTop ? 0 : stackOffset,
                                    transformOrigin: 'bottom center',
                                }}
                                drag={isTop ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.9}
                                onDragEnd={(_, info) => {
                                    if      (info.offset.x >  140) handleSwipe('right');
                                    else if (info.offset.x < -140) handleSwipe('left');
                                }}
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: isTop ? 1 : isSecond ? 0.94 : 0.89, opacity: isTop ? 1 : isSecond ? 0.7 : 0.45, y: 0 }}
                                exit={{
                                    x: x.get() >= 0 ? 600 : -600,
                                    rotate: x.get() >= 0 ? 20 : -20,
                                    opacity: 0,
                                    transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] }
                                }}
                                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                            >
                                <BuilderCard profile={profile} isTop={isTop} />

                                {/* Swipe Stamps */}
                                {isTop && (
                                    <>
                                        <motion.div
                                            className="absolute top-8 left-6 px-4 py-2 rounded-xl border-[3px] border-rose-500 text-rose-500 font-display font-black text-2xl tracking-tight -rotate-12 pointer-events-none select-none"
                                            style={{ opacity: passOpacity }}
                                        >
                                            PASS
                                        </motion.div>
                                        <motion.div
                                            className="absolute top-8 right-6 px-4 py-2 rounded-xl border-[3px] border-emerald-500 text-emerald-500 font-display font-black text-2xl tracking-tight rotate-12 pointer-events-none select-none"
                                            style={{ opacity: buildOpacity }}
                                        >
                                            BUILD
                                        </motion.div>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <SwipeControls
                onPass={() => handleSwipe('left')}
                onLike={() => handleSwipe('right')}
                onSuperLike={() => handleSwipe('super')}
                disabled={isAnimating}
            />

            {/* Keyboard hint */}
            <div className="flex items-center gap-1.5 mt-5 text-[11px] text-zinc-400">
                <Keyboard size={13} />
                <span>← → ↑ keyboard shortcuts</span>
            </div>
        </div>
    );
}
