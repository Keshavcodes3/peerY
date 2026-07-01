import { motion } from "framer-motion"
import { FolderKanban, GitBranch, CircleDot, CheckCircle2, Clock, Users } from "lucide-react"

const PROJECTS = [
    {
        name: "AI Resume Analyzer",
        stack: ["Next.js", "Python", "OpenAI"],
        status: "active",
        progress: 72,
        team: 3,
        branches: [
            { name: "feat(auth)", status: "merged" },
            { name: "feat(chat)", status: "merged" },
            { name: "fix(parser)", status: "open" },
        ],
    },
    {
        name: "DevConnect API",
        stack: ["Express", "PostgreSQL", "Redis"],
        status: "review",
        progress: 45,
        team: 2,
        branches: [
            { name: "feat(matching)", status: "merged" },
            { name: "feat(notifications)", status: "open" },
        ],
    },
]

export function ProjectView() {
    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <FolderKanban className="text-blue-600" size={24} />
                        Active Projects
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Ship real products with your team.</p>
                </div>
            </div>

            {/* Project Cards */}
            <div className="space-y-5">
                {PROJECTS.map((project, i) => (
                    <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.4 }}
                        whileHover={{ y: -2 }}
                        className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                    >
                        {/* Project Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold text-zinc-900 text-base">{project.name}</h4>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {project.stack.map(tech => (
                                        <span key={tech} className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Users size={12} /> {project.team}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider
                                    ${project.status === 'active' 
                                        ? 'bg-green-50 text-green-600 border border-green-100' 
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'}`}
                                >
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                                <span>Progress</span>
                                <span className="font-semibold text-zinc-700">{project.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ delay: 0.5 + i * 0.2, duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* Git Branches */}
                        <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2">
                            {project.branches.map(branch => (
                                <div key={branch.name} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-zinc-700 font-mono text-xs">
                                        <GitBranch size={13} className="text-zinc-400" />
                                        {branch.name}
                                    </span>
                                    <span className={`flex items-center gap-1 text-xs font-medium
                                        ${branch.status === 'merged' ? 'text-green-600' : 'text-blue-600'}`}
                                    >
                                        {branch.status === 'merged' 
                                            ? <><CheckCircle2 size={12} /> merged</>
                                            : <><CircleDot size={12} /> open</>
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}