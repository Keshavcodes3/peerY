import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Command } from 'lucide-react';
import FilterPills from './FilterPills';

interface DiscoverHeaderProps {
    onFilterChange?: (filterId: string) => void;
    onSearch?: (query: string) => void;
}

export default function DiscoverHeader({ onFilterChange, onSearch }: DiscoverHeaderProps) {
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <div className="px-8 pt-10 pb-6">
            {/* Hero headline */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6"
            >
                <h1 className="font-display font-bold text-4xl text-zinc-900 leading-[1.15] tracking-tight mb-2">
                    Find builders.{' '}
                    <span className="text-blue-600">Build together.</span>
                    <br />
                    Ship faster.{' '}
                    <motion.span
                        animate={{ rotate: [0, 15, -5, 15, 0] }}
                        transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.6 }}
                        className="inline-block"
                    >
                        🚀
                    </motion.span>
                </h1>
                <p className="text-zinc-500 text-base leading-relaxed max-w-xl">
                    Discover developers, designers, founders and builders that match your goals,
                    skills and ambitions.
                </p>
            </motion.div>

            {/* Search input */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative mb-5"
            >
                <div
                    className={`flex items-center gap-3 w-full max-w-2xl bg-white border-2 rounded-2xl px-5 py-3.5 transition-all duration-200 shadow-sm ${
                        focused
                            ? 'border-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]'
                            : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                >
                    <Search size={18} className={`shrink-0 transition-colors duration-200 ${focused ? 'text-blue-500' : 'text-zinc-400'}`} />
                    <input
                        type="text"
                        placeholder="Search by name, role, stack, or project type..."
                        value={query}
                        onChange={handleSearch}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 font-medium focus:outline-none"
                    />
                    <div className="flex items-center gap-1 shrink-0 text-zinc-300 border border-zinc-200 rounded-lg px-2 py-1">
                        <Command size={11} />
                        <span className="text-[11px] font-semibold">K</span>
                    </div>
                </div>
            </motion.div>

            {/* Filter pills */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
            >
                <FilterPills onFilterChange={onFilterChange} />
            </motion.div>
        </div>
    );
}
