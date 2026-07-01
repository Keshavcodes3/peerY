import { motion } from "framer-motion"
import { Code2, Rocket, Crown, ArrowRight } from "lucide-react"
import type { OnboardingData } from "../../types/onboarding.types"

interface Step3Props {
    data: OnboardingData
    onChange: (updates: Partial<OnboardingData>) => void
    onNext: () => void
}

const LEVELS = [
    {
        id: "beginner" as const,
        label: "Beginner",
        desc: "Learning the fundamentals.",
        detail: "< 1 year",
        icon: Code2,
        color: { ring: "border-green-300", icon: "bg-green-100 text-green-600", badge: "bg-green-50 border-green-200 text-green-700", dot: "bg-green-500", glow: "shadow-green-500/10" },
    },
    {
        id: "intermediate" as const,
        label: "Intermediate",
        desc: "Building independently.",
        detail: "1–3 years",
        icon: Rocket,
        color: { ring: "border-blue-300", icon: "bg-blue-100 text-blue-600", badge: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500", glow: "shadow-blue-500/10" },
    },
    {
        id: "advanced" as const,
        label: "Advanced",
        desc: "Leading and architecting.",
        detail: "3+ years",
        icon: Crown,
        color: { ring: "border-purple-300", icon: "bg-purple-100 text-purple-600", badge: "bg-purple-50 border-purple-200 text-purple-700", dot: "bg-purple-500", glow: "shadow-purple-500/10" },
    },
]

export function Step3Experience({ data, onChange, onNext }: Step3Props) {
    const selected = data.experience

    return (
        <div className="flex flex-col justify-center h-full px-10 lg:px-14">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-xs"
            >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-4">
                    Experience Level
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                    Where are you<br />
                    <span className="text-blue-600">in your journey?</span>
                </h2>

                <div className="mt-7 space-y-3">
                    {LEVELS.map((level, i) => {
                        const isActive = selected === level.id
                        const Icon = level.icon
                        return (
                            <motion.button
                                key={level.id}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onChange({ experience: level.id })}
                                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 outline-none
                                    ${isActive
                                        ? `${level.color.ring} shadow-lg ${level.color.glow} bg-white`
                                        : "border-zinc-200 bg-white hover:border-zinc-300"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? level.color.icon : "bg-zinc-100 text-zinc-500"}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-semibold text-sm text-zinc-900">{level.label}</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">{level.desc}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold shrink-0 transition-all duration-300 ${isActive ? level.color.badge : "bg-zinc-50 border-zinc-200 text-zinc-400"}`}>
                                    {level.detail}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>

                <motion.button
                    onClick={onNext}
                    disabled={!selected}
                    whileHover={selected ? { y: -1 } : {}}
                    whileTap={selected ? { scale: 0.98 } : {}}
                    className={`mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300
                        ${selected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"}`}
                >
                    Continue
                    <ArrowRight size={15} />
                </motion.button>
            </motion.div>
        </div>
    )
}
