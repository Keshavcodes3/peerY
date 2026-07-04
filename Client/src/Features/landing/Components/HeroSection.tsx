import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { useEffect, useState } from "react"
import {
  Brain,
  Users,
  Blocks,
  GitPullRequest,
  TrendingUp,
  ArrowRight
} from "lucide-react"

// Four curated journey states
const JOURNEY_STEPS = [
  {
    id: "learn",
    step: 1,
    label: "Learn",
    icon: Brain,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 border-blue-100",
    headline: "AI Learning Path",
    detail: "React → TypeScript → System Design",
    tag: "Learning with guidance",
    tagColor: "bg-blue-50 text-blue-600 border-blue-100",
    pulse: true,
  },

  {
    id: "connect",
    step: 2,
    label: "Connect",
    icon: Users,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
    headline: "Meet ambitious builders",
    detail: "Mentors • Developers • Contributors",
    tag: "People with similar goals",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pulse: false,
  },

  {
    id: "build",
    step: 3,
    label: "Build",
    icon: Blocks,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 border-violet-100",
    headline: "Join real projects",
    detail: "Startups • Open Source • Side Projects",
    tag: "Learning through execution",
    tagColor: "bg-violet-50 text-violet-700 border-violet-100",
    pulse: false,
  },

  {
    id: "contribute",
    step: 4,
    label: "Contribute",
    icon: GitPullRequest,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
    headline: "Build in public",
    detail: "Pull Requests • Reviews • Discussions",
    tag: "Public proof of work",
    tagColor: "bg-amber-50 text-amber-700 border-amber-100",
    pulse: false,
  },

  {
    id: "grow",
    step: 5,
    label: "Grow",
    icon: TrendingUp,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
    headline: "Level up continuously",
    detail: "Ranks • Streaks • Achievements",
    tag: "Become impossible to ignore",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    pulse: false,
  },
]

export function HeroSection() {
  const [currentStep, setCurrentStep] = useState(0)

  // Auto-advance through the story
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % JOURNEY_STEPS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  const step = JOURNEY_STEPS[currentStep]
  const Icon = step.icon

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-16 lg:gap-24">

      {/* ── Left Column ── */}
      <div className="flex-1 space-y-10 z-10 max-w-2xl relative">

        {/* Handwritten Note 1 */}
        <div
          className="
    absolute
    -top-14
    left-4
    -rotate-[5deg]
    hidden
    sm:block
    pointer-events-none
    select-none
  "
        >
          <span
            className="
      font-handwriting
      text-2xl
      text-blue-600/75
      tracking-wide
    "
          >
            your co-founder might be here →
          </span>

          <svg
            className="mt-[-2px] ml-2"
            width="180"
            height="12"
            viewBox="0 0 180 12"
            fill="none"
          >
            <path
              d="M2 8C40 2 80 12 178 4"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500/40"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.03] text-zinc-950">
            Your next teammate<br />
            is already{" "}
            <span className="relative inline-block whitespace-nowrap">
              online.
              <svg
                className="absolute -bottom-3 left-0 w-[108%] h-4 text-[#2563eb] overflow-visible"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M 2 5 Q 35 9 68 5 T 98 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.path
                  d="M 5 7 Q 45 4 74 7 T 95 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </span>
          </h1>

          {/* Sub-copy */}
          <p className="text-lg md:text-xl text-zinc-500 max-w-lg leading-relaxed font-light">
            Find ambitious developers,
            join serious projects,
            and turn ideas into shipped products.
          </p>
        </motion.div>

        {/* CTAs */}
        <div className="relative">
          {/* Handwritten Note 2 */}
          <div
            className="absolute -bottom-14 left-1/3 rotate-[5deg] text-zinc-400 font-handwriting text-xl pointer-events-none opacity-40 select-none hidden sm:block"
            aria-hidden="true"
          >
            weekend hackathon?
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="rounded-full text-base font-semibold px-8 h-12 bg-zinc-950 text-white hover:bg-zinc-800 transition-all duration-300 shadow-sm flex items-center gap-2 group"
            >
              Start Building
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base font-semibold px-8 h-12 border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-50 transition-all duration-300"
            >
              Explore Projects
            </Button>
          </motion.div>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-6 border-t border-zinc-100 flex items-center gap-3.5"
        >
          <div className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </div>
          <p className="text-sm font-medium text-zinc-500">
            Developers are matching, building, and shipping products every day.
          </p>
        </motion.div>
      </div>

      {/* ── Right Column: Story Panel ── */}
      <div className="flex-1 w-full max-w-md z-10 relative">

        {/* Handwritten Note 3 */}
        <div
          className="absolute -bottom-12 right-10 rotate-[-5deg] text-zinc-400 font-handwriting text-xl pointer-events-none opacity-40 select-none hidden sm:block"
          aria-hidden="true"
        >
          ship it.
        </div>

        {/* Card shell — stays fixed; only the interior morphs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.04)]"
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              A developer journey
            </span>
            <div className="w-10" />
          </div>

          {/* Story content */}
          <div className="px-8 py-10 min-h-[320px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${step.iconBg}`}
                >
                  <Icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                {/* Step label */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${step.tagColor}`}>
                    {step.pulse && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                      </span>
                    )}
                    {step.tag}
                  </span>
                </div>

                {/* Main text */}
                <div className="space-y-1.5">
                  <p className="text-2xl font-bold text-zinc-950 tracking-tight">
                    {step.headline}
                  </p>
                  <p className="text-sm font-mono text-zinc-400">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step progress bar at the bottom */}
          <div className="px-6 pb-6 pt-2 flex items-center gap-2">
            {JOURNEY_STEPS.map((s, i) => (
              <button
                key={s.id}
                aria-label={s.label}
                onClick={() => setCurrentStep(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentStep
                  ? "flex-1 bg-zinc-950"
                  : "w-6 bg-zinc-200 hover:bg-zinc-300"
                  }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Step label below card */}
        <div className="mt-4 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono text-zinc-400 tracking-wide"
            >
              {step.step} / {JOURNEY_STEPS.length} — {step.label}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
