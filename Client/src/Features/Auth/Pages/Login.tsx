import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';

const BG_WORDS = ["BUILD", "CONNECT", "SHIP", "LEARN", "BELONG"];

const HANDWRITTEN_NOTES = [
    { text: "your next teammate is here →", top: "25%", left: "65%", rotate: "-4deg" },
    { text: "one connection changes everything", top: "75%", left: "15%", rotate: "3deg" },
];

export default function Login() {
    const [wordIndex, setWordIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        
        const success = await login({ email, password });
        if (success) {
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % BG_WORDS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 15 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
        })
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8 selection:bg-blue-500/20 font-sans text-zinc-900">
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1200px] min-h-[720px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex border border-zinc-100 relative"
            >
                
                {/* LEFT EXPERIENCE (55%) */}
                <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-white border-r border-zinc-100 items-center px-16 xl:px-20 py-12">
                    
                    {/* Giant Background Word */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={wordIndex}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 0.02, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                className="font-black text-[140px] tracking-tighter text-zinc-900 leading-none"
                            >
                                {BG_WORDS[wordIndex]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Minimal Builder Journey Illustration */}
                    <div className="absolute top-12 right-12 opacity-40 pointer-events-none hidden xl:flex flex-col items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
                        <motion.span custom={1.2} initial="hidden" animate="visible" variants={fadeUp}>Learn</motion.span>
                        <motion.div custom={1.3} initial="hidden" animate="visible" variants={fadeUp} className="w-px h-6 bg-zinc-300" />
                        <motion.span custom={1.4} initial="hidden" animate="visible" variants={fadeUp}>Build</motion.span>
                        <motion.div custom={1.5} initial="hidden" animate="visible" variants={fadeUp} className="w-px h-6 bg-zinc-300" />
                        <motion.span custom={1.6} initial="hidden" animate="visible" variants={fadeUp}>Collaborate</motion.span>
                        <motion.div custom={1.7} initial="hidden" animate="visible" variants={fadeUp} className="w-px h-6 bg-zinc-300" />
                        <motion.span custom={1.8} initial="hidden" animate="visible" variants={fadeUp} className="text-blue-500">Ship</motion.span>
                    </div>

                    {/* Handwritten Notes */}
                    {HANDWRITTEN_NOTES.map((note, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 + idx * 0.5, duration: 1 }}
                            className="absolute font-handwriting text-xl text-blue-600/40 whitespace-nowrap"
                            style={{ top: note.top, left: note.left, rotate: note.rotate }}
                        >
                            {note.text}
                        </motion.div>
                    ))}

                    {/* Main Content */}
                    <div className="relative z-10 max-w-[450px]">
                        <motion.h1 
                            custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
                            className="text-5xl lg:text-6xl leading-[1.05] font-bold text-zinc-900 tracking-tight font-display"
                        >
                            Build with people <br/> who actually <span className="text-blue-600">ship.</span>
                        </motion.h1>
                        
                        <motion.p 
                            custom={0.5} initial="hidden" animate="visible" variants={fadeUp}
                            className="mt-6 text-lg text-zinc-500 leading-relaxed max-w-[450px]"
                        >
                            Join ambitious developers learning, building, contributing and creating opportunities together.
                        </motion.p>
                    </div>
                </div>

                {/* RIGHT FORM (45%) */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center px-10 sm:px-16 xl:px-20 bg-white relative z-20 py-12">
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="w-full max-w-[360px] mx-auto"
                    >
                        <div className="mb-8">
                            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2 block">Continue Building</span>
                            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">Welcome Back.</h2>
                            <p className="text-zinc-500 mt-2 text-sm">Sign in to your builder network.</p>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <button className="flex-1 h-12 bg-white border border-zinc-200 rounded-[14px] flex items-center justify-center gap-2 text-zinc-700 font-medium hover:border-zinc-300 hover:bg-zinc-50 hover:-translate-y-[1px] transition-all duration-200 shadow-sm text-sm">
                                <FaGithub className="text-lg" /> GitHub
                            </button>
                            <button className="flex-1 h-12 bg-white border border-zinc-200 rounded-[14px] flex items-center justify-center gap-2 text-zinc-700 font-medium hover:border-zinc-300 hover:bg-zinc-50 hover:-translate-y-[1px] transition-all duration-200 shadow-sm text-sm">
                                <FaGoogle className="text-lg" /> Google
                            </button>
                        </div>

                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t border-zinc-100"></div>
                            <span className="flex-shrink-0 mx-4 text-xs text-zinc-400 font-medium">or continue with email</span>
                            <div className="flex-grow border-t border-zinc-100"></div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-[12px] text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form className="space-y-3" onSubmit={handleLogin}>
                            <div>
                                <input 
                                    type="email" 
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 rounded-[14px] border border-zinc-200 bg-white placeholder-zinc-400 text-zinc-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 rounded-[14px] border border-zinc-200 bg-white placeholder-zinc-400 text-zinc-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 mt-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[14px] font-medium flex items-center justify-center gap-2 hover:-translate-y-[1px] transition-all duration-200 shadow-sm text-sm disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isLoading ? 'Authenticating...' : 'Enter PeerY \u2192'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-zinc-500 text-sm">
                                Don't have an account? <Link to="/register" className="text-zinc-900 font-medium hover:text-blue-600 transition-colors">Create one</Link>
                            </p>
                        </div>

                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
}