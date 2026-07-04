import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Code2, Rocket, Users, GitBranch, Crown,
    Flame, Terminal, Sparkles,
    BookOpen, Wrench, Briefcase
} from "lucide-react"
import type { OnboardingData } from "../types/onboarding.types"

interface IllustrationPanelProps {
    step: number
    data: OnboardingData
}

// ─── Step 1: Rotating Builder Stories ────────────────────────────────────────
const BUILDER_STORIES = [
    {
        avatar: "KS", name: "Keshav", role: "Frontend",
        story: "Needed a backend dev. Found one. Shipped in 11 days.",
        tag: "🚀 Shipped"
    },
    {
        avatar: "PR", name: "Priya", role: "Full Stack",
        story: "Stuck in tutorial hell. Got her first PR merged.",
        tag: "✅ First PR"
    },
    {
        avatar: "RK", name: "Rohan", role: "Founder",
        story: "Had an idea. 3 builders joined in 48 hours. 2k users.",
        tag: "📈 Growing"
    },
]

function Step1Illustration() {
    const [idx, setIdx] = useState(0)
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % BUILDER_STORIES.length), 3500)
        return () => clearInterval(t)
    }, [])
    const story = BUILDER_STORIES[idx]

    return (
        <div className="flex flex-col items-center justify-center h-full px-12 gap-8">
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-handwriting text-2xl text-blue-500/50 rotate-[-4deg] self-end"
            >
                your future teammate might be here →
            </motion.p>

            {/* Story card */}
            <div className="w-full max-w-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.97 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="bg-white rounded-3xl border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-7"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                                {story.avatar}
                            </div>
                            <div>
                                <p className="font-semibold text-zinc-900 text-sm">{story.name}</p>
                                <p className="text-xs text-zinc-500">{story.role} · PeerY Builder</p>
                            </div>
                            <div className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
                                {story.tag}
                            </div>
                        </div>
                        <p className="text-zinc-700 text-sm leading-relaxed">{story.story}</p>
                        <div className="flex items-center gap-1.5 mt-4 text-xs text-orange-500 font-semibold">
                            <Flame size={13} /> Active builder
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-5">
                    {BUILDER_STORIES.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === idx ? "w-6 bg-blue-500" : "w-1.5 bg-zinc-300"}`} />
                    ))}
                </div>
            </div>

            {/* Floating builder avatars */}
            <div className="flex -space-x-3 mt-2">
                {["AK", "SJ", "MD", "LP", "RV"].map((av, i) => (
                    <motion.div
                        key={av}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="w-9 h-9 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-xs font-bold text-zinc-600"
                    >
                        {av}
                    </motion.div>
                ))}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                >
                    +2k
                </motion.div>
            </div>
            <p className="text-xs text-zinc-400 font-medium -mt-4">Active builders this week</p>
        </div>
    )
}

// ─── Step 2: Profile Building Live ───────────────────────────────────────────
function Step2Illustration({ data }: { data: OnboardingData }) {
    const [stage, setStage] = useState(0)
    useEffect(() => {
        const t = setInterval(() => setStage(s => (s + 1) % 4), 1400)
        return () => clearInterval(t)
    }, [])

    const displayName = data.username?.trim() || "keshav_builds"

    return (
        <div className="flex flex-col items-center justify-center h-full px-12 gap-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">Profile taking shape...</p>

            <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 w-full max-w-sm">
                {/* Avatar */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-100 flex items-center justify-center mx-auto mb-5"
                >
                    <span className="font-bold text-blue-700 text-xl">
                        {displayName.charAt(0).toUpperCase()}
                    </span>
                </motion.div>

                <div className="text-center space-y-2">
                    <AnimatePresence mode="wait">
                        {stage === 0 ? (
                            <motion.div key="loading" exit={{ opacity: 0 }} className="space-y-2">
                                <div className="h-4 bg-zinc-100 rounded-full w-32 mx-auto animate-pulse" />
                                <div className="h-3 bg-zinc-50 rounded-full w-24 mx-auto animate-pulse" />
                            </motion.div>
                        ) : (
                            <motion.div key="name" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                <p className="font-display font-bold text-zinc-900">@{displayName}</p>
                                {stage >= 2 && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-zinc-500 mt-1">
                                        Frontend Engineer
                                    </motion.p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {stage >= 3 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 justify-center mt-5">
                        {["React", "TypeScript", "Node.js"].map((s, i) => (
                            <motion.span
                                key={s}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.12 }}
                                className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700"
                            >
                                {s}
                            </motion.span>
                        ))}
                    </motion.div>
                )}

                {stage >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-3 gap-3 text-center">
                        {[["0", "Projects"], ["0", "Peers"], ["Day 1", "Streak"]].map(([v, l]) => (
                            <div key={l}>
                                <p className="font-semibold text-zinc-900 text-sm">{v}</p>
                                <p className="text-xs text-zinc-400">{l}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

// ─── Step 3: Journey Path ─────────────────────────────────────────────────────
const JOURNEY_NODES = [
    { icon: Code2, label: "Beginner", color: "border-green-300 bg-green-50 text-green-600" },
    { icon: Rocket, label: "Builder", color: "border-blue-400 bg-blue-50 text-blue-600" },
    { icon: GitBranch, label: "Contributor", color: "border-purple-300 bg-purple-50 text-purple-600" },
    { icon: Users, label: "Mentor", color: "border-orange-300 bg-orange-50 text-orange-600" },
    { icon: Crown, label: "Founder", color: "border-yellow-400 bg-yellow-50 text-yellow-600" },
]

function Step3Illustration({ data }: { data: OnboardingData }) {
    const activeIdx = data.experience === "beginner" ? 0 : data.experience === "intermediate" ? 1 : data.experience === "advanced" ? 2 : -1

    return (
        <div className="flex flex-col items-center justify-center h-full px-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-8">Your Builder Path</p>
            <div className="relative flex flex-col items-center gap-0">
                {/* animated line */}
                <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-zinc-100 overflow-hidden">
                    <motion.div
                        className="w-full bg-blue-400 origin-top"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </div>
                {JOURNEY_NODES.map((node, i) => {
                    const Icon = node.icon
                    const isActive = i === activeIdx
                    const isPast = i < activeIdx
                    return (
                        <motion.div
                            key={node.label}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.4 }}
                            className={`relative z-10 flex items-center gap-4 mb-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                        >
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                ${isActive ? `${node.color} shadow-lg scale-110` : isPast ? "border-zinc-300 bg-zinc-100 text-zinc-400 scale-95" : "border-zinc-200 bg-white text-zinc-400"}`}
                            >
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-blue-400/20 blur-sm"
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                )}
                                <Icon size={16} />
                            </div>
                            <div className={`text-sm font-semibold transition-colors duration-300 w-24 ${i % 2 === 0 ? "text-left" : "text-right"} ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>
                                {node.label}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Step 4: Intent Mosaic ───────────────────────────────────────────────────
const INTENT_ICONS = [
    { icon: BookOpen, label: "Learning", color: "#2563EB" },
    { icon: Wrench, label: "Building", color: "#16a34a" },
    { icon: Users, label: "Teammates", color: "#9333ea" },
    { icon: GitBranch, label: "Open Source", color: "#dc2626" },
    { icon: Briefcase, label: "Internships", color: "#d97706" },
    { icon: Rocket, label: "Startup", color: "#0891b2" },
]

function Step4Illustration({ data }: { data: OnboardingData }) {
    return (
        <div className="flex flex-col items-center justify-center h-full px-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-8">Builder Ecosystem</p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {INTENT_ICONS.map((item, i) => {
                    const Icon = item.icon
                    const isSelected = data.intents.includes(item.label.toLowerCase().replace(" ", "")) ||
                        data.intents.includes(item.label.toLowerCase())
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.09, duration: 0.35 }}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-500
                                ${isSelected ? "bg-white shadow-lg border-transparent" : "bg-zinc-50 border-zinc-200"}`}
                            style={isSelected ? { borderColor: item.color + "40", boxShadow: `0 8px 24px ${item.color}18` } : {}}
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: isSelected ? item.color + "18" : "#f4f4f5" }}>
                                <Icon size={17} style={{ color: isSelected ? item.color : "#a1a1aa" }} />
                            </div>
                            <span className={`text-xs font-semibold text-center leading-tight transition-colors duration-300 ${isSelected ? "text-zinc-800" : "text-zinc-400"}`}>
                                {item.label}
                            </span>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Step 5: Tech Constellation ──────────────────────────────────────────────
function Step5Illustration({ data }: { data: OnboardingData }) {
    const allStack = ["React", "Next.js", "Node.js", "TypeScript", "Python", "Go", "PostgreSQL", "MongoDB", "Docker", "Vercel", "GraphQL", "Prisma"]
    return (
        <div className="flex flex-col items-center justify-center h-full px-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-8">Your Stack</p>
            <div className="relative w-64 h-64">
                {/* center core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30"
                    >
                        <Terminal size={22} className="text-white" />
                    </motion.div>
                </div>
                {/* orbiting chips */}
                {allStack.map((tech, i) => {
                    const isSelected = data.stack.includes(tech)
                    const angle = (i / allStack.length) * Math.PI * 2
                    const radius = 96
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius
                    return (
                        <motion.div
                            key={tech}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.06, type: "spring", bounce: 0.3 }}
                            className={`absolute text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-500 whitespace-nowrap
                                ${isSelected ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20" : "bg-white text-zinc-500 border-zinc-200"}`}
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                transform: "translate(-50%, -50%)"
                            }}
                        >
                            {tech}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Step 6: Skill Cloud ──────────────────────────────────────────────────────
function Step6Illustration({ data }: { data: OnboardingData }) {
    return (
        <div className="flex flex-col items-center justify-center h-full px-12 gap-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Skills Cloud</p>
            <div className="w-full max-w-sm min-h-[200px] flex flex-wrap gap-3 items-center justify-center">
                <AnimatePresence>
                    {data.skills.length === 0 ? (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-zinc-400 text-sm font-medium">
                            Your skills will appear here...
                        </motion.p>
                    ) : (
                        data.skills.map((skill) => (
                            <motion.div
                                key={skill}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", bounce: 0.4 }}
                                className="px-4 py-2 rounded-2xl bg-white border border-blue-200 text-blue-700 text-sm font-semibold shadow-md shadow-blue-500/5"
                            >
                                {skill}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-handwriting text-2xl text-zinc-400/60 rotate-[2deg]"
            >
                build in public →
            </motion.p>
        </div>
    )
}

// ─── Step 7: Network Preview ─────────────────────────────────────────────────
function Step7Illustration({ data }: { data: OnboardingData }) {
    const displayName = data.username?.trim() || "you"
    const builders = ["AK", "SJ", "MD", "LP", "RV", "DK"]

    return (
        <div className="flex flex-col items-center justify-center h-full px-12 gap-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Builder Network</p>
            {/* Network visualization */}
            <div className="relative w-64 h-64">
                {/* center — "you" */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 text-white font-bold text-xs">
                        {displayName.slice(0, 3).toUpperCase()}
                    </div>
                </motion.div>
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                    {builders.map((_, i) => {
                        const angle = (i / builders.length) * Math.PI * 2
                        const r = 96
                        const x = 128 + Math.cos(angle) * r
                        const y = 128 + Math.sin(angle) * r
                        return (
                            <motion.line
                                key={i}
                                x1="128" y1="128" x2={x} y2={y}
                                stroke="#e4e4e7" strokeWidth="1.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                            />
                        )
                    })}
                </svg>
                {/* surrounding builders */}
                {builders.map((av, i) => {
                    const angle = (i / builders.length) * Math.PI * 2
                    const r = 96
                    const x = 128 + Math.cos(angle) * r
                    const y = 128 + Math.sin(angle) * r
                    return (
                        <motion.div
                            key={av}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1, type: "spring", bounce: 0.4 }}
                            className="absolute w-10 h-10 rounded-full bg-zinc-100 border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-zinc-600"
                            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
                        >
                            {av}
                        </motion.div>
                    )
                })}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                <Sparkles size={16} className="text-blue-500" />
                2,000+ builders waiting to connect
            </div>
        </div>
    )
}

// ─── Main Panel ──────────────────────────────────────────────────────────────
export function IllustrationPanel({ step, data }: IllustrationPanelProps) {
    return (
        <div className="relative w-full h-full bg-zinc-50/70 border-l border-zinc-100 overflow-hidden">
            {/* Subtle grid */}
            <div className="absolute inset-0 grid-bg opacity-50" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10 w-full h-full"
                >
                    {step === 1 && <Step1Illustration />}
                    {step === 2 && <Step2Illustration data={data} />}
                    {step === 3 && <Step3Illustration data={data} />}
                    {step === 4 && <Step4Illustration data={data} />}
                    {step === 5 && <Step5Illustration data={data} />}
                    {step === 6 && <Step6Illustration data={data} />}
                    {step === 7 && <Step7Illustration data={data} />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
