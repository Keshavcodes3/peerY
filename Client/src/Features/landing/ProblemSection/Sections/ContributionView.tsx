import { motion } from "framer-motion"
import { GitPullRequest, GitMerge, Star, ExternalLink, TrendingUp } from "lucide-react"

const CONTRIBUTIONS = [
    { repo: "vercel/next.js", type: "PR Merged", title: "Fix hydration mismatch in App Router", stars: "120k", date: "2 days ago", status: "merged" },
    { repo: "shadcn/ui", type: "PR Open", title: "Add combobox accessibility improvements", stars: "68k", date: "5 days ago", status: "open" },
    { repo: "t3-oss/create-t3-app", type: "PR Merged", title: "Update Drizzle ORM template config", stars: "24k", date: "1 week ago", status: "merged" },
    { repo: "tailwindlabs/tailwindcss", type: "Issue", title: "Report: Container queries in JIT mode", stars: "81k", date: "2 weeks ago", status: "closed" },
]

const STREAK_DATA = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => Math.random())
)

function getIntensity(value: number): string {
    if (value < 0.15) return "bg-zinc-100"
    if (value < 0.35) return "bg-blue-100"
    if (value < 0.55) return "bg-blue-300"
    if (value < 0.75) return "bg-blue-500"
    return "bg-blue-700"
}

export function ContributionView() {
    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <GitPullRequest className="text-blue-600" size={24} />
                        Contributions
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Your open source impact at a glance.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
                    <TrendingUp size={14} />
                    42 this month
                </div>
            </div>

            {/* Contribution Graph */}
            <div className="mb-8 p-5 bg-zinc-50/50 border border-zinc-100 rounded-2xl">
                <div className="flex gap-[3px] overflow-hidden">
                    {STREAK_DATA.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                            {week.map((day, di) => (
                                <motion.div
                                    key={`${wi}-${di}`}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (wi * 7 + di) * 0.002, duration: 0.2 }}
                                    className={`w-[10px] h-[10px] rounded-[2px] ${getIntensity(day)} hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition-all cursor-pointer`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-zinc-400">
                    <span>Less</span>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-100" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-100" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-300" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-500" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-blue-700" />
                    <span>More</span>
                </div>
            </div>

            {/* Recent Contributions */}
            <div className="space-y-3">
                {CONTRIBUTIONS.map((contrib, i) => (
                    <motion.div
                        key={contrib.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
                        whileHover={{ x: 4 }}
                        className="group flex items-start gap-4 p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
                    >
                        {/* Status Icon */}
                        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5
                            ${contrib.status === 'merged' 
                                ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                                : contrib.status === 'open' 
                                    ? 'bg-green-50 text-green-600 border border-green-100' 
                                    : 'bg-zinc-50 text-zinc-500 border border-zinc-200'}`}
                        >
                            {contrib.status === 'merged' ? <GitMerge size={16} /> : <GitPullRequest size={16} />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">{contrib.title}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs text-zinc-500 font-mono">{contrib.repo}</span>
                                <span className="flex items-center gap-0.5 text-xs text-zinc-400">
                                    <Star size={10} /> {contrib.stars}
                                </span>
                                <span className="text-xs text-zinc-400">{contrib.date}</span>
                            </div>
                        </div>

                        {/* External Link */}
                        <ExternalLink size={14} className="text-zinc-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}