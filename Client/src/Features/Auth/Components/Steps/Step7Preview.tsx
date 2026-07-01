import { motion } from "framer-motion"
import { User, Check, Flame, ArrowRight } from "lucide-react"
import type { OnboardingData } from "../../types/onboarding.types"

interface Step7Props {
    data: OnboardingData
    onSubmit: () => void
    isLoading?: boolean
    error?: string | null
}

const EXP_LABELS: Record<string, string> = {
    beginner: "Beginner Engineer",
    intermediate: "Intermediate Engineer",
    advanced: "Senior Engineer",
}

export function Step7Preview({ data, onSubmit, isLoading, error }: Step7Props) {
    const displayName = data.username || "your_username"
    const role = EXP_LABELS[data.experience] ?? "Engineer"

    return (
        <div className="flex flex-col justify-center h-full px-10 lg:px-14">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-xs"
            >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-4">
                    Profile Preview
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                    You're all set.<br />
                    <span className="text-blue-600">Let's build.</span>
                </h2>
                <p className="mt-3 text-sm text-zinc-500">
                    Your profile is ready. Meet the builders.
                </p>

                {/* Compact profile card */}
                <motion.div
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="mt-6 bg-white border border-zinc-200 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border border-blue-100 shrink-0"
                        >
                            <User size={20} className="text-blue-600" />
                        </motion.div>
                        <div>
                            <p className="font-display font-bold text-zinc-900 text-sm">@{displayName}</p>
                            <p className="text-xs text-zinc-500">{role}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-600 text-xs font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </div>
                    </div>

                    {/* Stack chips */}
                    {data.stack.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-wrap gap-1.5 mb-3">
                            {data.stack.slice(0, 4).map((tech, i) => (
                                <motion.span
                                    key={tech}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5 + i * 0.07 }}
                                    className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                            {data.stack.length > 4 && <span className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-500">+{data.stack.length - 4}</span>}
                        </motion.div>
                    )}

                    {/* Streak + intents */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-3 border-t border-zinc-100">
                        <div className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
                            <Flame size={13} /> Day 1
                        </div>
                        <div className="flex gap-2">
                            {data.intents.slice(0, 2).map(intent => (
                                <span key={intent} className="flex items-center gap-1 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-full font-medium capitalize">
                                    <Check size={10} className="text-green-500" /> {intent}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-4 font-handwriting text-xl text-zinc-400/70 rotate-[-2deg]"
                >
                    one connection changes everything ✦
                </motion.p>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-[12px] text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={onSubmit}
                    whileHover={{ y: -2, boxShadow: "0 12px 30px rgba(37,99,235,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? 'Joining Network...' : 'Enter the Builder Network'}
                    {!isLoading && <ArrowRight size={15} />}
                </motion.button>
            </motion.div>
        </div>
    )
}
