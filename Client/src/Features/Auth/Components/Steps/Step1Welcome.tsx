import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { FaGithub } from "react-icons/fa"

interface Step1Props {
    onNext: () => void
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

export function Step1Welcome({ onNext }: Step1Props) {
    return (
        <div className="flex flex-col justify-center h-full px-10 lg:px-14">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-5">
                    Welcome to PeerY
                </p>

                <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08]">
                    Find people<br />
                    worth<br />
                    <span className="text-blue-600">building with.</span>
                </h1>

                <p className="mt-5 text-base text-zinc-500 leading-relaxed max-w-xs">
                    Learn, build, contribute and grow with ambitious developers.
                </p>

                <div className="mt-8 space-y-3 max-w-xs">
                    <motion.button
                        whileHover={{ y: -1, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNext}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 text-zinc-800 text-sm font-semibold hover:border-zinc-300 transition-all duration-200"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </motion.button>

                    <motion.button
                        whileHover={{ y: -1, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNext}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all duration-200"
                    >
                        <FaGithub size={18} />
                        Continue with GitHub
                    </motion.button>

                    <div className="flex items-center gap-4 py-1">
                        <div className="flex-1 h-px bg-zinc-100" />
                        <span className="text-xs text-zinc-400 font-medium">or</span>
                        <div className="flex-1 h-px bg-zinc-100" />
                    </div>

                    <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNext}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-zinc-200 text-zinc-600 text-sm font-semibold hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                    >
                        <Mail size={16} />
                        Continue with Email
                    </motion.button>
                </div>

                <p className="mt-5 text-xs text-zinc-400 max-w-xs">
                    By continuing, you agree to our Terms and Privacy Policy.
                </p>
            </motion.div>
        </div>
    )
}
