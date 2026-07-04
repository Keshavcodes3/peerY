import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Send, Bot, User, Lightbulb } from "lucide-react"

const SUGGESTIONS = [
    "What should I learn next?",
    "Review my portfolio",
    "Help me write a README",
    "Explain system design basics",
]

const CONVERSATION = [
    {
        role: "user" as const,
        message: "I know React and Node.js. What should I learn next to stand out?",
    },
    {
        role: "ai" as const,
        message: "Based on your stack, I'd recommend diving into **Redis** for caching and **Docker** for deployments. These two skills are massively in-demand and will level you up from builder to production-ready engineer.",
    },
    {
        role: "user" as const,
        message: "Any project ideas to practice these?",
    },
    {
        role: "ai" as const,
        message: "Try building a **real-time chat app** with Redis pub/sub and containerize it with Docker Compose. Ship it, and you'll have a strong portfolio piece.",
    },
]

export function AiMentorView() {
    const [inputValue, setInputValue] = useState("")

    return (
        <div className="h-full flex flex-col p-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <Sparkles className="text-blue-600" size={24} />
                        AI Mentor
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Get personalized guidance instantly.</p>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-green-50 border border-green-100 text-green-600 text-xs font-semibold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-1">
                {CONVERSATION.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.35 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'ai' && (
                            <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mt-0.5">
                                <Bot size={16} className="text-blue-600" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                            ${msg.role === 'user' 
                                ? 'bg-zinc-900 text-white rounded-br-md' 
                                : 'bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-bl-md'}`}
                        >
                            {msg.message.split('**').map((part, j) => 
                                j % 2 === 1 
                                    ? <span key={j} className={`font-semibold ${msg.role === 'user' ? 'text-blue-300' : 'text-blue-600'}`}>{part}</span>
                                    : <span key={j}>{part}</span>
                            )}
                        </div>
                        {msg.role === 'user' && (
                            <div className="shrink-0 w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mt-0.5">
                                <User size={16} className="text-zinc-300" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Quick Suggestions */}
            <motion.div 
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {SUGGESTIONS.map(suggestion => (
                    <button 
                        key={suggestion}
                        className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 font-medium hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center gap-1.5"
                    >
                        <Lightbulb size={12} />
                        {suggestion}
                    </button>
                ))}
            </motion.div>

            {/* Input */}
            <div className="relative">
                <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask your AI mentor anything..."
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-white border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-300 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Send size={14} />
                </button>
            </div>
        </div>
    )
}