import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Rocket,
    Code2,
    Users,
    GitBranch,
    Crown,
    CheckCircle2,
    ArrowRight,
    Trophy,
    TerminalSquare
} from "lucide-react"

const JOURNEY = [
    {
        id: "beginner",
        title: "Beginner",
        subtitle: "Start Learning",
        icon: Code2,
        skills: ["React", "TypeScript", "Tailwind CSS"],
        projects: ["Portfolio", "Todo App"],
        nextMilestone: "Build a Full-Stack App",
        active: false,
    },
    {
        id: "builder",
        title: "Builder",
        subtitle: "Ship Projects",
        icon: Rocket,
        skills: ["Node.js", "PostgreSQL", "Next.js"],
        projects: ["SaaS MVP", "E-commerce API"],
        nextMilestone: "Contribute to OSS",
        active: true, // Making this one active for demonstration
    },
    {
        id: "contributor",
        title: "Contributor",
        subtitle: "Open Source",
        icon: GitBranch,
        skills: ["Git Workflows", "CI/CD", "Testing"],
        projects: ["Merged 5 PRs", "Documentation Updates"],
        nextMilestone: "Mentor a Beginner",
        active: false,
    },
    {
        id: "mentor",
        title: "Mentor",
        subtitle: "Help Others",
        icon: Users,
        skills: ["Code Review", "System Design", "Communication"],
        projects: ["Guided 3 Builders", "Tech Talks"],
        nextMilestone: "Lead a Team",
        active: false,
    },
    {
        id: "founder",
        title: "Founder",
        subtitle: "Build Teams",
        icon: Crown,
        skills: ["Leadership", "Product Strategy", "Architecture"],
        projects: ["Launched Product", "Scaled to 10k Users"],
        nextMilestone: "Keep Innovating",
        active: false,
    },
]

export function RoadmapView() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <div className="h-full flex flex-col pt-8 overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-sm font-medium tracking-[0.2em] text-blue-600 uppercase mb-3">
                        Your Builder Journey
                    </p>
                    <h3 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
                        Evolve as a Developer
                    </h3>
                    <p className="mt-5 text-zinc-500 max-w-xl mx-auto text-lg leading-relaxed">
                        Track your progression from writing your first lines of code to building products and leading teams.
                    </p>
                </motion.div>
            </div>

            {/* Journey */}
            <div className="relative flex-1 flex flex-col items-center pb-20">
                {/* Animated Line */}
                <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-zinc-100 hidden sm:block overflow-hidden">
                    <motion.div
                        className="w-full bg-blue-500 origin-top"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col gap-8">
                    {/* Handwritten Annotation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                        animate={{ opacity: 1, scale: 1, rotate: -6 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="absolute -right-[120px] top-[220px] text-blue-600 font-handwriting text-3xl hidden lg:block select-none"
                    >
                        you're closer than you think →
                    </motion.div>

                    {JOURNEY.map((step, index) => {
                        const Icon = step.icon;
                        const isHovered = hoveredNode === step.id;
                        const isActive = step.active;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
                                onHoverStart={() => setHoveredNode(step.id)}
                                onHoverEnd={() => setHoveredNode(null)}
                                className="relative flex items-start gap-6 group"
                            >
                                {/* Node Icon */}
                                <div className="relative mt-2 shrink-0 hidden sm:block">
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        />
                                    )}
                                    <div className={`
                                        relative w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300 z-10
                                        ${isActive
                                            ? "border-blue-500 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                            : isHovered
                                                ? "border-blue-300 text-blue-500"
                                                : "border-zinc-200 text-zinc-400"
                                        }
                                    `}>
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                </div>

                                {/* Card */}
                                <motion.div
                                    layout
                                    className={`
                                        flex-1 bg-white rounded-2xl border p-6 transition-all duration-300
                                        ${isActive ? "border-blue-200 shadow-sm" : "border-zinc-200/80"}
                                        ${isHovered ? "border-blue-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] -translate-y-1" : ""}
                                    `}
                                >
                                    <motion.div layout className="flex items-center justify-between">
                                        <div>
                                            <motion.h4 layout className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-3">
                                                <span className="sm:hidden text-blue-600">
                                                    <Icon size={20} />
                                                </span>
                                                {step.title}
                                            </motion.h4>
                                            <motion.p layout className="text-zinc-500 text-sm mt-1 font-medium">
                                                {step.subtitle}
                                            </motion.p>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider"
                                            >
                                                Current
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Expandable Content */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden border-t border-zinc-100 pt-5"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Skills */}
                                                    <div>
                                                        <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                                            <TerminalSquare size={14} />
                                                            Skills Unlocked
                                                        </h5>
                                                        <ul className="space-y-2">
                                                            {step.skills.map(skill => (
                                                                <li key={skill} className="flex items-center gap-2 text-sm text-zinc-600">
                                                                    <CheckCircle2 size={14} className="text-blue-500" />
                                                                    {skill}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Projects / Milestone */}
                                                    <div className="space-y-5">
                                                        <div>
                                                            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                                                                <Trophy size={14} />
                                                                Key Achievements
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {step.projects.map(project => (
                                                                    <span key={project} className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 font-medium">
                                                                        {project}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                                                <ArrowRight size={16} />
                                                                {step.nextMilestone}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}