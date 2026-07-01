import { useState, useCallback, useEffect } from 'react';
import { useMotionValue } from 'framer-motion';
import { type BuilderProfile } from '../data/mockData';

export function useSwipeDeck(
    profiles: BuilderProfile[],
    onMatch: (profile: BuilderProfile) => void
) {
    const [stack, setStack] = useState<BuilderProfile[]>(profiles);
    const [isAnimating, setIsAnimating] = useState(false);
    const [lastAction, setLastAction] = useState<'left' | 'right' | 'super' | null>(null);

    const x = useMotionValue(0);

    const handleSwipe = useCallback((direction: 'left' | 'right' | 'super') => {
        if (stack.length === 0 || isAnimating) return;

        const currentProfile = stack[0];
        setLastAction(direction);
        setIsAnimating(true);

        // Animate x for programmatic swipes
        const targetX = direction === 'left' ? -500 : 500;
        x.set(targetX);

        setTimeout(() => {
            setStack(prev => prev.slice(1));
            x.set(0);
            setIsAnimating(false);
            setLastAction(null);

            if (direction === 'right' || direction === 'super') {
                if (currentProfile.matchPercentage > 80 || direction === 'super') {
                    onMatch(currentProfile);
                }
            }
        }, 350);
    }, [stack, isAnimating, onMatch, x]);

    const resetStack = useCallback(() => {
        setStack(profiles);
        x.set(0);
        setIsAnimating(false);
    }, [profiles, x]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowLeft')  handleSwipe('left');
            if (e.key === 'ArrowRight') handleSwipe('right');
            if (e.key === 'ArrowUp')    handleSwipe('super');
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleSwipe]);

    return { stack, x, handleSwipe, resetStack, isAnimating, lastAction };
}
