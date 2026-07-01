import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Wrench, Users, GitBranch, Briefcase, Rocket, ArrowRight, Check } from "lucide-react"
import type { OnboardingData } from "../../types/onboarding.types"

interface Step4Props {
    data: OnboardingData
    onChange: (updates: Partial<OnboardingData>) => void
    onNext: () => void
}

const INTENTS = [
    { id: "learning", label: "Learning", icon: BookOpen, color: "#2563EB" },
    { id: "building", label: "Building", icon: Wrench, color: "#16a34a" },
    { id: "teammates", label: "Teammates", icon: Users, color: "#9333ea" },
    { id: "opensource", label: "Open Source", icon: GitBranch, color: "#dc2626" },
    { id: "internships", label: "Internships", icon: Briefcase, color: "#d97706" },
    { id: "startup", label: "Startup", icon: Rocket, color: "#0891b2" },
]

export function Step4Intent({ data, onChange, onNext }: Step4Props) {
    const selected = data.intents

    const toggle = (id: string) => {
        if (selected.includes(id)) onChange({ intents: selected.filter(i => i !== id) })
        else onChange({ intents: [...selected, id] })
    }

    return (
        <div className="flex flex-col justify-center h-full px-10 lg:px-14">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-xs"
            >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-4">
                    Your Intent
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                    What are you<br />
                    <span className="text-blue-600">here to do?</span>
                </h2>
                <p className="mt-3 text-sm text-zinc-500">Select all that apply.</p>

                <motion.div layout className="mt-7 grid grid-cols-2 gap-2.5">
                    {INTENTS.map((intent, i) => {
                        const isSelected = selected.includes(intent.id)
                        const Icon = intent.icon
                        return (
                            <motion.button
                                key={intent.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => toggle(intent.id)}
                                className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 outline-none overflow-hidden
                                    ${isSelected ? "bg-white shadow-md" : "bg-white border-zinc-200 hover:border-zinc-300"}`}
                                style={isSelected ? { borderColor: intent.color + "60", boxShadow: `0 4px 20px ${intent.color}12` } : {}}
                            >
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: intent.color }}
                                        >
                                            <Check size={10} strokeWidth={3} className="text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 transition-colors duration-300"
                                    style={{ backgroundColor: isSelected ? intent.color + "18" : "#f4f4f5" }}
                                >
                                    <Icon size={16} style={{ color: isSelected ? intent.color : "#71717a" }} />
                                </div>
                                <p className="text-xs font-semibold text-zinc-900">{intent.label}</p>
                            </motion.button>
                        )
                    })}
                </motion.div>

                <div className="flex items-center justify-between mt-6">
                    <AnimatePresence>
                        {selected.length > 0 && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-zinc-500">
                                <span className="font-semibold text-zinc-900">{selected.length}</span> selected
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <motion.button
                        onClick={onNext}
                        disabled={selected.length === 0}
                        whileHover={selected.length > 0 ? { y: -1 } : {}}
                        whileTap={selected.length > 0 ? { scale: 0.98 } : {}}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${selected.length > 0 ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"}`}
                    >
                        Continue
                        <ArrowRight size={14} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}
