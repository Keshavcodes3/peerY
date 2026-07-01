import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import type { OnboardingData } from "../../types/onboarding.types"

interface Step5Props {
    data: OnboardingData
    onChange: (updates: Partial<OnboardingData>) => void
    onNext: () => void
}

const SUGGESTED_STACK = [
    "React", "Next.js", "Vue", "Svelte",
    "Node.js", "Express", "NestJS", "FastAPI",
    "TypeScript", "Python", "Go", "Rust",
    "PostgreSQL", "MongoDB", "Redis",
    "Docker", "AWS", "Vercel",
    "GraphQL", "Prisma",
]

const CHIP_COLORS: Record<string, string> = {
    "React": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "Next.js": "bg-zinc-900 text-white border-zinc-700",
    "Node.js": "bg-green-50 text-green-700 border-green-200",
    "TypeScript": "bg-blue-50 text-blue-700 border-blue-200",
    "Python": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Go": "bg-sky-50 text-sky-700 border-sky-200",
    "Rust": "bg-orange-50 text-orange-700 border-orange-200",
    "default": "bg-zinc-50 text-zinc-700 border-zinc-200",
}

export function Step5Stack({ data, onChange, onNext }: Step5Props) {
    const selected = data.stack

    const toggle = (tech: string) => {
        if (selected.includes(tech)) onChange({ stack: selected.filter(t => t !== tech) })
        else onChange({ stack: [...selected, tech] })
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
                    Tech Stack
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                    What do you<br />
                    <span className="text-blue-600">build with?</span>
                </h2>

                {/* Selected chips */}
                <AnimatePresence>
                    {selected.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="flex flex-wrap gap-1.5">
                                    <AnimatePresence>
                                        {selected.map(tech => (
                                            <motion.button
                                                key={tech}
                                                layout
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                onClick={() => toggle(tech)}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${CHIP_COLORS[tech] ?? CHIP_COLORS["default"]} hover:opacity-70 transition-opacity`}
                                            >
                                                {tech} <X size={10} />
                                            </motion.button>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* All tech chips */}
                <motion.div layout className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTED_STACK.filter(t => !selected.includes(t)).map((tech, i) => (
                        <motion.button
                            key={tech}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.025 }}
                            whileHover={{ y: -2, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggle(tech)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 hover:shadow-md ${CHIP_COLORS[tech] ?? CHIP_COLORS["default"]}`}
                        >
                            {tech}
                        </motion.button>
                    ))}
                </motion.div>

                <div className="flex items-center justify-between mt-6">
                    <p className="text-xs text-zinc-400">{selected.length} selected</p>
                    <motion.button
                        onClick={onNext}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                    >
                        Continue <ArrowRight size={14} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}
