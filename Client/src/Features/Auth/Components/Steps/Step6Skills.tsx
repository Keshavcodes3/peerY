import { useState } from "react"
import type { KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plus, X } from "lucide-react"
import type { OnboardingData } from "../../types/onboarding.types"

interface Step6Props {
    data: OnboardingData
    onChange: (updates: Partial<OnboardingData>) => void
    onNext: () => void
}

const SUGGESTED_SKILLS = [
    "System Design", "Frontend", "Backend", "DevOps", "AI / ML",
    "Open Source", "Mobile", "Security", "Technical Writing", "API Design",
]

export function Step6Skills({ data, onChange, onNext }: Step6Props) {
    const [input, setInput] = useState("")
    const selected = data.skills

    const addSkill = (skill: string) => {
        const trimmed = skill.trim()
        if (trimmed && !selected.includes(trimmed)) onChange({ skills: [...selected, trimmed] })
        setInput("")
    }

    const removeSkill = (skill: string) => onChange({ skills: selected.filter(s => s !== skill) })

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); addSkill(input) }
        if (e.key === "Backspace" && !input && selected.length > 0) removeSkill(selected[selected.length - 1])
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
                    Your Skills
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                    What do you<br />
                    <span className="text-blue-600">bring to the table?</span>
                </h2>
                <p className="mt-3 text-sm text-zinc-500">Type a skill and press Enter.</p>

                {/* Tag input */}
                <div className="relative mt-6 bg-white border-2 border-zinc-200 rounded-2xl p-3.5 focus-within:border-blue-300 focus-within:shadow-lg focus-within:shadow-blue-500/5 transition-all duration-300 min-h-[100px]">
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {selected.map(skill => (
                                <motion.span
                                    key={skill}
                                    layout
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0.35, duration: 0.4 }}
                                    className="group flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold"
                                >
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="opacity-50 group-hover:opacity-100 hover:text-red-500 transition-all">
                                        <X size={11} />
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder={selected.length === 0 ? "e.g. System Design..." : "Add more..."}
                            className="flex-1 min-w-[120px] text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none py-0.5"
                        />
                    </div>
                    {input.trim() && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => addSkill(input)}
                            className="absolute right-3 bottom-3 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={14} />
                        </motion.button>
                    )}
                </div>

                {/* Suggestions */}
                <div className="mt-4">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">Quick add</p>
                    <motion.div layout className="flex flex-wrap gap-2">
                        {SUGGESTED_SKILLS.filter(s => !selected.includes(s)).map((skill, i) => (
                            <motion.button
                                key={skill}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                whileHover={{ y: -1, scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addSkill(skill)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-medium hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                                <Plus size={10} /> {skill}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                <motion.p className="mt-4 font-handwriting text-lg text-zinc-400/70 rotate-[-1deg]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    keep building →
                </motion.p>

                <div className="flex justify-end mt-5">
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
