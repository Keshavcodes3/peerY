import { useState } from 'react';
import { motion } from 'framer-motion';

const FILTER_PILLS = [
    { id: 'for-you', label: 'For You', emoji: '✨' },
    { id: 'top-match', label: 'Top Match', emoji: '🎯' },
    { id: 'active', label: 'Recently Active', emoji: '🟢' },
    { id: 'open', label: 'Open To Build', emoji: '🔨' },
    { id: 'new', label: 'New Builders', emoji: '🚀' },
    { id: 'founders', label: 'Founders', emoji: '💡' },
    { id: 'designers', label: 'Designers', emoji: '🎨' },
    { id: 'developers', label: 'Developers', emoji: '⚡' },
];

interface FilterPillsProps {
    onFilterChange?: (filterId: string) => void;
}

export default function FilterPills({ onFilterChange }: FilterPillsProps) {
    const [active, setActive] = useState('for-you');

    const handleSelect = (id: string) => {
        setActive(id);
        onFilterChange?.(id);
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {FILTER_PILLS.map((pill) => (
                <motion.button
                    key={pill.id}
                    onClick={() => handleSelect(pill.id)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${active === pill.id
                            ? 'text-white'
                            : 'text-zinc-500 hover:text-zinc-900 bg-zinc-100/80 hover:bg-zinc-200/80'
                        }`}
                >
                    {/* Active background with layoutId for smooth slide */}
                    {active === pill.id && (
                        <motion.span
                            layoutId="active-pill"
                            className="absolute inset-0 bg-zinc-900 rounded-full"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 text-xs">{pill.emoji}</span>
                    <span className="relative z-10">{pill.label}</span>
                </motion.button>
            ))}
        </div>
    );
}
