import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface OnboardingNavbarProps {
    step: number
    totalSteps: number
    onBack?: () => void
}

export function OnboardingNavbar({ step, totalSteps, onBack }: OnboardingNavbarProps) {
    const navigate = useNavigate()
    const progressPercent = (step / totalSteps) * 100

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <motion.button
                        onClick={onBack ?? (() => navigate("/"))}
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </motion.button>
                    <div className="w-px h-4 bg-zinc-200" />
                    <span className="font-display font-bold text-zinc-900 text-lg">PeerY</span>
                </div>

                {/* Step Counter */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={step}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="text-xs font-semibold text-zinc-400 tracking-wider uppercase"
                    >
                        Step {step} of {totalSteps}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* Animated Progress Bar */}
            <div className="h-[2px] bg-zinc-100 relative overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                />
            </div>
        </header>
    )
}
