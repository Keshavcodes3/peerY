import { motion } from "framer-motion"
import { ArrowRight, User, AtSign, Lock, ChevronDown } from "lucide-react"
import type { OnboardingData } from "../../types/onboarding.types"

interface Step2Props {
    data: OnboardingData
    onChange: (updates: Partial<OnboardingData>) => void
    onNext: () => void
}

export function Step2Identity({ data, onChange, onNext }: Step2Props) {
    const canProceed = data.username.trim().length >= 3 && !!data.gender && !!data.email

    return (
        <div className="flex flex-col justify-center h-full px-10 lg:px-14">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-xs"
            >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-4">
                    Your Identity
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
                    Who are you<br />
                    <span className="text-blue-600">as a builder?</span>
                </h2>
                <p className="mt-3 text-sm text-zinc-500">
                    This is how the community will find you.
                </p>

                <div className="mt-7 space-y-3">
                    {/* Username */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                            <AtSign size={15} />
                        </div>
                        <input
                            type="text"
                            placeholder="username"
                            value={data.username}
                            onChange={e => onChange({ username: e.target.value.toLowerCase().replace(/\s/g, "_") })}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-300 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300 font-mono"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                            <User size={15} />
                        </div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={data.email}
                            onChange={e => onChange({ email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-300 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                            <Lock size={15} />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={e => onChange({ password: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-300 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300"
                        />
                    </div>

                    {/* Gender */}
                    <div className="relative">
                        <select
                            value={data.gender}
                            onChange={e => onChange({ gender: e.target.value })}
                            className="w-full appearance-none px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-700 focus:border-blue-300 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not">Prefer not to say</option>
                        </select>
                        <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    <motion.button
                        onClick={onNext}
                        disabled={!canProceed}
                        whileHover={canProceed ? { y: -1 } : {}}
                        whileTap={canProceed ? { scale: 0.98 } : {}}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300
                            ${canProceed
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"}`}
                    >
                        Continue
                        <ArrowRight size={15} />
                    </motion.button>
                </div>

                <p className="mt-5 font-handwriting text-lg text-zinc-400/70 rotate-[-1deg]">
                    everyone starts somewhere ✦
                </p>
            </motion.div>
        </div>
    )
}
