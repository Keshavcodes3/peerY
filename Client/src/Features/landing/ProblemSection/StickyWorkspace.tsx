import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Users, FolderKanban, Sparkles, GitPullRequest } from "lucide-react"

import { RoadmapView } from "./Sections/RoadmapView"
import { PeerView } from "./Sections/PeerView"
import { ProjectView } from "./Sections/ProjectView"
import { AiMentorView } from "./Sections/AiMentorView"
import { ContributionView } from "./Sections/ContributionView"

const SECTIONS = [
    { 
        id: "roadmap", 
        title: "Builder Roadmap", 
        desc: "Your path from beginner to founder.",
        icon: Map, 
        component: RoadmapView 
    },
    { 
        id: "peers", 
        title: "Peer Network", 
        desc: "Connect with like-minded builders.",
        icon: Users, 
        component: PeerView 
    },
    { 
        id: "projects", 
        title: "Projects", 
        desc: "Ship real-world applications.",
        icon: FolderKanban, 
        component: ProjectView 
    },
    { 
        id: "mentor", 
        title: "AI Mentor", 
        desc: "Get unblocked instantly.",
        icon: Sparkles, 
        component: AiMentorView 
    },
    { 
        id: "contributions", 
        title: "Open Source", 
        desc: "Build your reputation.",
        icon: GitPullRequest, 
        component: ContributionView 
    },
]

export default function StickyWorkspace() {
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <section className="relative py-24 px-6 max-w-[1400px] mx-auto">
            {/* Elite Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[750px]">
                
                {/* Navigation / Mini-Bento */}
                <div className="lg:col-span-3 flex flex-col gap-3">
                    {SECTIONS.map((section, idx) => {
                        const isActive = idx === activeIndex
                        const Icon = section.icon
                        
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveIndex(idx)}
                                className={`
                                    relative group p-4 rounded-2xl flex items-start gap-4 text-left transition-all duration-300 outline-none
                                    ${isActive ? '' : 'hover:bg-zinc-50/80'}
                                `}
                            >
                                {/* Active Background Pill */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="workspace-active-pill"
                                        className="absolute inset-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                    />
                                )}
                                
                                {/* Icon Container */}
                                <div className={`relative z-10 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                                    ${isActive 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-100' 
                                        : 'bg-zinc-100 text-zinc-500 group-hover:text-zinc-900 group-hover:bg-zinc-200 group-hover:scale-105'}
                                `}>
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                
                                {/* Text Content */}
                                <div className="relative z-10 pt-1">
                                    <h4 className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-zinc-900' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                                        {section.title}
                                    </h4>
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.p 
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="text-xs text-zinc-500 font-medium leading-relaxed"
                                            >
                                                {section.desc}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Main Featured Content Area */}
                <div className="lg:col-span-9 relative bg-white rounded-[32px] border border-zinc-200 shadow-[0_20px_80px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                    {/* Subtle top glare/gradient for premium feel */}
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/50 to-transparent opacity-50 pointer-events-none" />
                    
                    <div className="flex-1 overflow-hidden relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -15, scale: 0.98, filter: "blur(4px)" }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full w-full"
                            >
                                {(() => {
                                    const ActiveComponent = SECTIONS[activeIndex].component
                                    return <ActiveComponent />
                                })()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    )
}