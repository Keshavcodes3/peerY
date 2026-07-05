import { motion } from "framer-motion"
import { Users, MessagesSquare, Code, Flame } from "lucide-react"

const PEERS = [
    { name: "Keshav", role: "Frontend Builder", status: "online", activity: "Working on UI components", streak: 12 },
    { name: "Aryan", role: "Backend Eng", status: "online", activity: "Debugging API routes", streak: 5 },
    { name: "Rishabh", role: "Fullstack", status: "offline", activity: "Last seen 2h ago", streak: 21 },
    { name: "Divyansh", role: "UI/UX Designer", status: "online", activity: "Designing Figma mockups", streak: 8 },
]

export function PeerView() {
    return (
        <div className="h-full flex flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <Users className="text-blue-600" size={24} />
                        Your Network
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Builders you are actively collaborating with.</p>
                </div>
                <div className="flex -space-x-3">
                    {PEERS.slice(0,3).map((peer) => (
                        <div key={peer.name} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 z-10 relative">
                            {peer.name.charAt(0)}
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-xs font-medium text-zinc-500 z-0 relative">
                        +1
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PEERS.map((peer, i) => (
                    <motion.div
                        key={peer.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="group relative bg-white border border-zinc-200 rounded-2xl p-4 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center font-bold text-blue-600">
                                        {peer.name.charAt(0)}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${peer.status === 'online' ? 'bg-green-500' : 'bg-zinc-300'}`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-zinc-900 text-sm flex items-center gap-2">
                                        {peer.name}
                                        <span className="flex items-center text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md font-medium">
                                            <Flame size={12} className="mr-0.5" /> {peer.streak}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-zinc-500">{peer.role}</p>
                                </div>
                            </div>
                            <button className="text-zinc-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                <MessagesSquare size={16} />
                            </button>
                        </div>
                        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-600">
                            <Code size={14} className="text-zinc-400" />
                            {peer.activity}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}