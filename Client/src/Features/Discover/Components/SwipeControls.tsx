import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Star } from 'lucide-react';

interface SwipeControlsProps {
    onPass: () => void;
    onLike: () => void;
    onSuperLike: () => void;
    disabled?: boolean;
}

interface MagneticButtonProps {
    onClick: () => void;
    disabled?: boolean;
    size: 'sm' | 'md' | 'lg';
    variant: 'pass' | 'super' | 'like';
    children: React.ReactNode;
    label: string;
}

const BUTTON_STYLES = {
    pass:  'bg-white hover:bg-rose-50 border-zinc-200 hover:border-rose-200 text-zinc-400 hover:text-rose-500 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.15)]',
    super: 'bg-white hover:bg-blue-50 border-zinc-200 hover:border-blue-300 text-zinc-400 hover:text-blue-600 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.18)]',
    like:  'bg-white hover:bg-emerald-50 border-zinc-200 hover:border-emerald-200 text-zinc-400 hover:text-emerald-500 shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.15)]',
};

const SIZE_CLASSES = {
    sm:  'w-12 h-12',
    md:  'w-14 h-14',
    lg:  'w-16 h-16',
};

function MagneticButton({ onClick, disabled, size, variant, children, label }: MagneticButtonProps) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <motion.button
                onClick={onClick}
                disabled={disabled}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className={`
                    relative ${SIZE_CLASSES[size]} rounded-full border-2 
                    flex items-center justify-center
                    transition-colors duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    magnetic-btn
                    ${BUTTON_STYLES[variant]}
                `}
            >
                {/* Ripple ring on hover */}
                <motion.div
                    className={`absolute inset-0 rounded-full ${
                        variant === 'pass'  ? 'bg-rose-400/10'  :
                        variant === 'super' ? 'bg-blue-400/10'  :
                        'bg-emerald-400/10'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">{children}</span>
            </motion.button>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
        </div>
    );
}

export default function SwipeControls({ onPass, onLike, onSuperLike, disabled }: SwipeControlsProps) {
    return (
        <div className="flex items-end justify-center gap-6 mt-8 px-4">
            <MagneticButton onClick={onPass} disabled={disabled} size="lg" variant="pass" label="Pass">
                <X size={26} strokeWidth={2.5} />
            </MagneticButton>

            <MagneticButton onClick={onSuperLike} disabled={disabled} size="md" variant="super" label="Super">
                <Star size={22} strokeWidth={2.5} />
            </MagneticButton>

            <MagneticButton onClick={onLike} disabled={disabled} size="lg" variant="like" label="Build">
                <Heart size={26} strokeWidth={2.5} />
            </MagneticButton>
        </div>
    );
}
