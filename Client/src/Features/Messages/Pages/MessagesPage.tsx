import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare, Send, Loader2, AlertCircle, Wifi, Search, X
} from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { api, ENDPOINT, tokenStore } from "../../../App/api";
import { useAuth } from "../../Auth/Hooks/useAuth";

interface MatchUser {
    _id: string;
    username: string;
    email: string;
}

interface Match {
    _id: string;
    userOne: MatchUser;
    userTwo: MatchUser;
    accepted: boolean;
    matchedAt?: string;
}

interface ChatMessage {
    id: string;
    from: string;
    text: string;
    ts: number;
}

const SERVER_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function MessagesPage() {
    const { user } = useAuth();
    const [matches, setMatches] = useState<Match[]>([]);
    const [selected, setSelected] = useState<Match | null>(null);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
    const [input, setInput] = useState("");
    const [isLoadingMatches, setIsLoadingMatches] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch accepted matches
    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoadingMatches(true);
            setError(null);
            try {
                const res = await api.get<{ success: boolean; data: Match[] }>(ENDPOINT.match.getAll);
                setMatches(res.data.data ?? []);
            } catch (err: any) {
                setError(err?.response?.data?.error ?? "Failed to load matches");
            } finally {
                setIsLoadingMatches(false);
            }
        };
        fetchMatches();
    }, []);

    // Connect socket
    useEffect(() => {
        const token = tokenStore.get();
        if (!token) return;

        const socket = io(SERVER_URL, {
            auth: { token },
            transports: ["polling", "websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => setSocketConnected(true));
        socket.on("disconnect", () => setSocketConnected(false));
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });

        // Receive direct messages
        socket.on("direct:message", (data: { matchId: string; from: string; text: string; ts: number; id?: string }) => {
            setMessages(prev => {
                const current = prev[data.matchId] ?? [];
                // Check if message already exists by ID or by matching fields
                const exists = current.some(m => 
                    m.id === data.id || 
                    (m.from === data.from && m.text === data.text && Math.abs(m.ts - data.ts) < 2000)
                );
                if (exists) return prev;

                const msg: ChatMessage = {
                    id: data.id || `${data.from}-${data.ts}`,
                    from: data.from,
                    text: data.text,
                    ts: data.ts
                };
                return {
                    ...prev,
                    [data.matchId]: [...current, msg],
                };
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Scroll whenever selected match messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, selected?._id]);

    const sendMessage = () => {
        if (!input.trim() || !selected || !socketRef.current) return;
        const myId = user?._id ?? user?.userId ?? "me";

        const msg: ChatMessage = {
            id: `${myId}-${Date.now()}`,
            from: myId,
            text: input.trim(),
            ts: Date.now(),
        };

        // Emit to server
        socketRef.current.emit("direct:message", {
            matchId: selected._id,
            text: input.trim(),
        });

        // Optimistically append
        setMessages(prev => ({
            ...prev,
            [selected._id]: [...(prev[selected._id] ?? []), msg],
        }));
        setInput("");
    };

    const getOtherUser = (match: Match): MatchUser => {
        const myId = user?._id ?? user?.userId;
        if (!myId) return match.userOne;
        return match.userOne._id === myId ? match.userTwo : match.userOne;
    };

    const filteredMatches = matches.filter(match => {
        const other = getOtherUser(match);
        return (other.username || "").toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Fetch chat history and join room when conversation selection changes
    useEffect(() => {
        if (!selected) return;

        const fetchHistory = async () => {
            try {
                const res = await api.get<{ success: boolean; data: ChatMessage[] }>(ENDPOINT.messages.history(selected._id));
                if (res.data.success) {
                    setMessages(prev => ({
                        ...prev,
                        [selected._id]: res.data.data,
                    }));
                }
            } catch (err) {
                console.error("Failed to load chat history:", err);
            }
        };

        fetchHistory();

        if (socketRef.current) {
            socketRef.current.emit("join:match", selected._id);
        }
    }, [selected?._id]);

    const selectedMessages = selected ? (messages[selected._id] ?? []) : [];

    return (
        <div className="flex h-full bg-white">
            {/* Sidebar — match list */}
            <div className="w-64 border-r border-zinc-100 flex flex-col shrink-0">
                <div className="p-4 border-b border-zinc-100 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-black font-display text-zinc-950">Messages</h2>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${socketConnected ? "bg-emerald-500" : "bg-zinc-300"}`} />
                            {socketConnected ? "Connected" : "Connecting…"}
                        </p>
                    </div>
                    <div className="relative">
                        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-zinc-900 placeholder-zinc-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-zinc-700 cursor-pointer"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoadingMatches ? (
                        <div className="flex justify-center pt-8">
                            <Loader2 size={18} className="animate-spin text-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center">
                            <AlertCircle size={20} className="text-red-400 mx-auto mb-2" />
                            <p className="text-xs text-zinc-500">{error}</p>
                        </div>
                    ) : matches.length === 0 ? (
                        <div className="p-4 text-center text-xs text-zinc-400 pt-8">
                            <MessageSquare size={24} className="mx-auto mb-2 text-zinc-200" />
                            No matches yet. Go discover builders!
                        </div>
                    ) : filteredMatches.length === 0 && searchQuery ? (
                        <div className="p-4 text-center text-xs text-zinc-400 pt-8">
                            No chats match "{searchQuery}"
                        </div>
                    ) : (
                        filteredMatches.map(match => {
                            const other = getOtherUser(match);
                            const isActive = selected?._id === match._id;
                            const lastMsg = (messages[match._id] ?? []).slice(-1)[0];
                            return (
                                <button
                                    key={match._id}
                                    onClick={() => setSelected(match)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                        isActive ? "bg-blue-50" : "hover:bg-zinc-50"
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase shrink-0 ${
                                        isActive ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-violet-500"
                                    }`}>
                                        {other.username?.[0] ?? "U"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-bold truncate ${isActive ? "text-blue-700" : "text-zinc-950"}`}>
                                            {other.username}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 truncate">
                                            {lastMsg ? lastMsg.text : "Start chatting…"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat panel */}
            <div className="flex-1 flex flex-col min-w-0">
                {!selected ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-300">
                        <MessageSquare size={40} />
                        <p className="text-sm font-bold text-zinc-400">Select a match to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Chat header */}
                        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-white/90 backdrop-blur shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                                {getOtherUser(selected).username?.[0] ?? "U"}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-950">{getOtherUser(selected).username}</p>
                                <p className="text-[10px] text-zinc-400">Matched builder</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-zinc-50/30">
                            {selectedMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-300">
                                    <Wifi size={28} />
                                    <p className="text-xs font-semibold text-zinc-400">
                                        Say hello to {getOtherUser(selected).username}!
                                    </p>
                                </div>
                            ) : selectedMessages.map(msg => {
                                const myId = user?._id ?? user?.userId;
                                const isMe = msg.from === myId || msg.from === "me";
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                                            isMe
                                                ? "bg-blue-600 text-white rounded-br-sm"
                                                : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm"
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input bar */}
                        <div className="px-4 py-3 border-t border-zinc-100 bg-white shrink-0">
                            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    placeholder="Type a message…"
                                    className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 min-w-0"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || !socketConnected}
                                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                            {!socketConnected && (
                                <p className="text-[10px] text-amber-500 font-semibold mt-1 px-1">
                                    Reconnecting to chat server…
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
