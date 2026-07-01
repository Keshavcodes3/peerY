import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Zap, UserCheck, Bell, Code2 } from 'lucide-react';

interface ActivityEvent {
    id: string;
    type: 'view' | 'like' | 'match' | 'join' | 'invite';
    actor: string;
    actorAvatar: string;
    message: string;
    timeAgo: string;
}

const ACTIVITY_POOL: ActivityEvent[] = [
    { id: 'a1', type: 'view',   actor: 'James Chen',     actorAvatar: 'https://i.pravatar.cc/40?u=james',  message: 'viewed your profile',           timeAgo: 'Just now' },
    { id: 'a2', type: 'like',   actor: 'Neha Gupta',     actorAvatar: 'https://i.pravatar.cc/40?u=neha',   message: 'liked your project InterviewAI',timeAgo: '1m ago' },
    { id: 'a3', type: 'match',  actor: 'Aryan Kapoor',   actorAvatar: 'https://i.pravatar.cc/40?u=aryan',  message: 'matched with you 🎉',           timeAgo: '3m ago' },
    { id: 'a4', type: 'join',   actor: 'Riya Mehta',     actorAvatar: 'https://i.pravatar.cc/40?u=riya',   message: 'joined your project',           timeAgo: '5m ago' },
    { id: 'a5', type: 'invite', actor: 'Marcus Webb',    actorAvatar: 'https://i.pravatar.cc/40?u=marcus', message: 'invited you to TimeCanvas',      timeAgo: '8m ago' },
    { id: 'a6', type: 'view',   actor: 'Elena Rodriguez',actorAvatar: 'https://i.pravatar.cc/40?u=elena',  message: 'viewed your profile',           timeAgo: '10m ago' },
    { id: 'a7', type: 'like',   actor: 'Yuki Tanaka',    actorAvatar: 'https://i.pravatar.cc/40?u=yuki',   message: 'super-liked your stack',        timeAgo: '12m ago' },
    { id: 'a8', type: 'match',  actor: 'Sarah Jenkins',  actorAvatar: 'https://i.pravatar.cc/40?u=sarah',  message: 'is now a match!',               timeAgo: '15m ago' },
];

const TYPE_META: Record<string, { icon: React.ReactNode; color: string }> = {
    view:   { icon: <Eye size={12} />,      color: 'bg-zinc-100 text-zinc-500' },
    like:   { icon: <Zap size={12} />,      color: 'bg-rose-50 text-rose-500' },
    match:  { icon: <UserCheck size={12} />,color: 'bg-emerald-50 text-emerald-600' },
    join:   { icon: <Code2 size={12} />,    color: 'bg-blue-50 text-blue-600' },
    invite: { icon: <Bell size={12} />,     color: 'bg-violet-50 text-violet-600' },
};

export default function LiveActivityFeed() {
    const [events, setEvents] = useState<ActivityEvent[]>(ACTIVITY_POOL.slice(0, 3));

    // Simulate new events arriving
    useEffect(() => {
        let idx = 3;
        const interval = setInterval(() => {
            if (idx >= ACTIVITY_POOL.length) { idx = 0; }
            const next = { ...ACTIVITY_POOL[idx], id: `${ACTIVITY_POOL[idx].id}-${Date.now()}`, timeAgo: 'Just now' };
            setEvents(prev => [next, ...prev].slice(0, 6));
            idx++;
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="relative w-3 h-3">
                        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-status-ping opacity-60" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Live Activity</h4>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">Real-time</span>
            </div>

            {/* Feed */}
            <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                    {events.map((event, i) => {
                        const meta = TYPE_META[event.type];
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50/80 border border-zinc-100 hover:bg-zinc-100/80 transition-colors"
                                style={{ opacity: 1 - i * 0.12 }}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <img
                                        src={event.actorAvatar}
                                        alt={event.actor}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                                    />
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${meta.color}`}>
                                        {meta.icon}
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] text-zinc-700 leading-snug">
                                        <span className="font-semibold text-zinc-900">{event.actor}</span>{' '}
                                        {event.message}
                                    </p>
                                    <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">{event.timeAgo}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
