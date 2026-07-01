import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components for Animations ---

const RoadmapAnimation = () => {
    const steps = ["React", "TypeScript", "Backend", "System Design"];
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % steps.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-8">
            {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">
                    <motion.div
                        animate={{
                            backgroundColor: activeIndex === idx ? '#2563EB' : '#f4f4f5',
                            color: activeIndex === idx ? '#ffffff' : '#71717a',
                            borderColor: activeIndex === idx ? '#2563EB' : '#e4e4e7',
                            scale: activeIndex === idx ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
                    >
                        {step}
                    </motion.div>
                    {idx < steps.length - 1 && (
                        <motion.div
                            animate={{
                                backgroundColor: activeIndex >= idx + 1 ? '#2563EB' : '#e4e4e7',
                            }}
                            className="w-[2px] h-6 my-1"
                        />
                    )}
                </div>
            ))}
            <div className="absolute top-10 right-10 font-handwriting text-blue-600/70 text-xl rotate-[-6deg]">
                start here →
            </div>
        </div>
    );
};

const AIMentorAnimation = () => {
    return (
        <div className="flex flex-col h-full justify-center px-8 w-full max-w-sm mx-auto space-y-6">
            <div className="self-end bg-zinc-100 text-zinc-700 px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                What should I learn after React?
            </div>
            <div className="self-start bg-blue-50 border border-blue-100 text-blue-900 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] shadow-sm flex flex-col gap-1">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <span className="font-semibold">TypeScript</span>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                    Build a project
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                    Learn backend fundamentals
                </motion.div>
                <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-4 bg-blue-600 mt-1"
                />
            </div>
        </div>
    );
};

const PeerMatchingAnimation = () => {
    return (
        <div className="flex items-center justify-center h-full w-full relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <motion.line x1="30%" y1="50%" x2="50%" y2="40%" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                <motion.line x1="50%" y1="40%" x2="70%" y2="50%" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                <motion.line x1="30%" y1="50%" x2="70%" y2="50%" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
            </svg>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute left-[25%] top-[45%] bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium z-10 text-zinc-700">Keshav</motion.div>
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute left-[45%] top-[35%] bg-white border border-blue-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium z-10 text-blue-700">Arjun</motion.div>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }} className="absolute left-[65%] top-[45%] bg-white border border-zinc-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium z-10 text-zinc-700">Sarah</motion.div>

            <div className="absolute bottom-10 left-10 font-handwriting text-blue-600/70 text-xl rotate-[4deg]">
                find your people →
            </div>
        </div>
    );
};

const ProjectsAnimation = () => {
    const states = ["Chat", "Idea", "Repository", "Project"];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIdx((prev) => (prev + 1) % states.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [states.length]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative">
            <div className="h-32 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white border border-zinc-200 shadow-sm px-8 py-4 rounded-2xl text-lg font-medium text-zinc-800"
                    >
                        {states[idx]}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 right-12 font-handwriting text-blue-600/70 text-xl rotate-[-3deg]">
                ship something cool
            </div>
        </div>
    );
};


// --- Main Section Component ---

export default function EcosystemSection() {
    return (
        <section className="w-full bg-white py-32 px-6 sm:px-12 lg:px-24">
            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="mb-24 max-w-2xl">
                    <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.05] font-display">
                        Everything you need <br /> to learn, build <br /> and <span className="text-blue-600">grow together.</span>
                    </h2>
                    <p className="mt-8 text-lg lg:text-xl text-zinc-500 leading-relaxed max-w-lg">
                        Most platforms solve one problem. PeerY combines learning, collaboration, projects, community and AI guidance into a single builder ecosystem.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Card 01 - Roadmaps */}
                    <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden flex flex-col h-[450px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                        <div className="p-10 pb-0 flex-shrink-0 relative z-20">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3 block">LEARN</span>
                            <h3 className="text-2xl font-bold text-zinc-900">Structured Roadmaps</h3>
                            <p className="text-zinc-500 mt-2 text-sm max-w-[250px] leading-relaxed">
                                Follow curated learning paths without wondering what to learn next.
                            </p>
                        </div>
                        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-transparent to-zinc-50/50 mt-4">
                            <RoadmapAnimation />
                        </div>
                    </div>

                    {/* Card 02 - AI Mentor */}

                    <div
                        className="
    group
    relative
    h-[450px]
    overflow-hidden
    rounded-[36px]
    border
    border-zinc-200
    bg-white
    hover:border-blue-100
    hover:shadow-[0_30px_80px_rgba(37,99,235,0.08)]
    transition-all
    duration-500
  "
                    >
                        {/* BACKGROUND */}

                        <div
                            className="
      absolute
      inset-0
      bg-gradient-to-b
      from-white
      via-white
      to-blue-50/30
    "
                        />

                        {/* HUGE TYPOGRAPHY */}

                        <div
                            className="
      absolute
      right-6
      top-2
      text-[140px]
      font-black
      leading-none
      text-blue-50
      select-none
      pointer-events-none
    "
                        >
                            AI
                        </div>

                        {/* HEADER */}

                        <div className="relative z-10 p-10">
                            <span
                                className="
        text-[10px]
        font-bold
        uppercase
        tracking-[0.25em]
        text-blue-600
      "
                            >
                                GUIDANCE
                            </span>

                            <h3
                                className="
        mt-4
        text-[30px]
        font-bold
        tracking-tight
        text-zinc-950
      "
                            >
                                Never wonder
                                <br />
                                what next.
                            </h3>
                        </div>

                        {/* ROADMAP */}

                        <div
                            className="
      absolute
      left-12
      top-[150px]
      right-12
      bottom-10
    "
                        >
                            <div className="relative h-full">

                                {/* Line */}

                                <div
                                    className="
          absolute
          left-[11px]
          top-4
          bottom-4
          w-px
          bg-zinc-200
        "
                                />

                                {[
                                    "React",
                                    "TypeScript",
                                    "Backend",
                                    "System Design",
                                    "Projects",
                                    "Open Source",
                                ].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.08,
                                        }}
                                        className="
            relative
            flex
            items-center
            gap-4
            mb-5
          "
                                    >
                                        <div
                                            className="
              h-6
              w-6
              rounded-full
              border
              border-zinc-200
              bg-white
              flex
              items-center
              justify-center
              shrink-0
            "
                                        >
                                            <div
                                                className="
                h-2
                w-2
                rounded-full
                bg-zinc-400
              "
                                            />
                                        </div>

                                        <span
                                            className="
              text-sm
              font-medium
              text-zinc-700
            "
                                        >
                                            {item}
                                        </span>
                                    </motion.div>
                                ))}

                                {/* MOVING AI DOT */}

                                <motion.div
                                    animate={{
                                        y: [0, 45, 90, 135, 180, 225, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 6,
                                        ease: "easeInOut",
                                    }}
                                    className="
          absolute
          left-[2px]
          top-[12px]
          h-5
          w-5
          rounded-full
          bg-blue-600
          shadow-[0_0_25px_rgba(37,99,235,0.8)]
        "
                                />
                            </div>
                        </div>

                        {/* HANDWRITTEN */}

                        <div
                            className="
      absolute
      right-8
      bottom-6
      rotate-[-5deg]
      font-handwriting
      text-xl
      text-blue-500/70
    "
                        >
                            figuring out what next?
                        </div>
                    </div>

                    {/* Card 03 - Peer Matching */}
                    <div
                        className="
    group
    relative
    h-[450px]
    overflow-hidden
    rounded-[36px]
    border
    border-zinc-200
    bg-white
    p-10
    transition-all
    duration-500
    hover:border-blue-100
    hover:shadow-[0_30px_80px_rgba(37,99,235,0.08)]
  "
                    >
                        {/* Background Typography */}

                        <div
                            className="
      absolute
      -right-6
      -top-6
      text-[140px]
      font-black
      tracking-[-0.08em]
      text-blue-50
      select-none
      pointer-events-none
      leading-none
    "
                        >
                            CONNECT
                        </div>

                        {/* Label */}

                        <span
                            className="
      relative
      z-10
      text-[10px]
      font-bold
      uppercase
      tracking-[0.25em]
      text-blue-600
    "
                        >
                            CONNECT
                        </span>

                        {/* Hero Copy */}

                        <div className="relative z-10 mt-8">
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="
        text-[48px]
        leading-[0.9]
        tracking-[-0.05em]
        font-black
        text-zinc-950
      "
                            >
                                WE FIND
                                <br />
                                THE
                                <span className="text-blue-600">
                                    {" "}OTHERS.
                                </span>
                            </motion.h3>

                            <p
                                className="
        mt-6
        max-w-[260px]
        text-sm
        leading-relaxed
        text-zinc-500
      "
                            >
                                People building the same things,
                                learning the same skills and solving
                                the same problems.
                            </p>
                        </div>

                        {/* Skills */}

                        <div
                            className="
      absolute
      left-10
      right-10
      bottom-24
      flex
      flex-wrap
      gap-3
    "
                        >
                            {[
                                "React",
                                "TypeScript",
                                "Backend",
                                "AI",
                                "Open Source",
                                "System Design",
                            ].map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.06,
                                    }}
                                    whileHover={{
                                        y: -3,
                                    }}
                                    className="
          rounded-full
          border
          border-zinc-200
          bg-zinc-50
          px-4
          py-2
          text-sm
          font-medium
          text-zinc-700
        "
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>

                        {/* Builder Count */}

                        <motion.div
                            animate={{
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2.5,
                            }}
                            className="
      absolute
      left-10
      bottom-10
      flex
      items-center
      gap-3
    "
                        >
                            <div
                                className="
        h-2
        w-2
        rounded-full
        bg-blue-600
      "
                            />

                            <span
                                className="
        text-sm
        font-semibold
        text-zinc-900
      "
                            >
                                2,431 active builders
                            </span>
                        </motion.div>

                        {/* Handwritten */}

                        <div
                            className="
      absolute
      right-10
      bottom-8
      rotate-[-5deg]
      font-handwriting
      text-xl
      text-blue-500/70
      select-none
    "
                        >
                            find your tribe →
                        </div>
                    </div>

                    {/* Card 04 - Projects & Chat */}
                    <div
                        className="
    group
    relative
    h-[450px]
    overflow-hidden
    rounded-[36px]
    border
    border-zinc-200
    bg-white
    p-10
    transition-all
    duration-500
    hover:border-blue-100
    hover:shadow-[0_30px_80px_rgba(37,99,235,0.08)]
  "
                    >
                        {/* Background */}

                        <div
                            className="
      absolute
      -right-4
      -top-6
      text-[140px]
      font-black
      tracking-[-0.08em]
      text-blue-50
      leading-none
      select-none
      pointer-events-none
    "
                        >
                            BUILD
                        </div>

                        {/* Header */}

                        <span
                            className="
      text-[10px]
      font-bold
      uppercase
      tracking-[0.25em]
      text-blue-600
    "
                        >
                            BUILD
                        </span>

                        <h3
                            className="
      mt-5
      text-[42px]
      leading-[0.95]
      tracking-[-0.05em]
      font-black
      text-zinc-950
    "
                        >
                            Turn Ideas
                            <br />
                            Into Reality.
                        </h3>

                        <p
                            className="
      mt-4
      max-w-[280px]
      text-sm
      leading-relaxed
      text-zinc-500
    "
                        >
                            Find teammates, start projects,
                            collaborate and ship together.
                        </p>

                        {/* Pipeline */}

                        <div
                            className="
      absolute
      left-10
      right-10
      bottom-20
      flex
      items-center
      justify-between
    "
                        >
                            {[
                                "Idea",
                                "Team",
                                "Build",
                                "Ship",
                            ].map((step, index) => (
                                <div
                                    key={step}
                                    className="
          relative
          flex
          flex-col
          items-center
        "
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.08, 1],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            delay: index * 0.3,
                                        }}
                                        className="
            h-12
            w-12
            rounded-full
            border
            border-zinc-200
            bg-white
            flex
            items-center
            justify-center
            text-sm
            font-semibold
            shadow-sm
          "
                                    >
                                        {index + 1}
                                    </motion.div>

                                    <span
                                        className="
            mt-3
            text-xs
            font-medium
            text-zinc-600
          "
                                    >
                                        {step}
                                    </span>

                                    {index !== 3 && (
                                        <div
                                            className="
              absolute
              top-6
              left-full
              h-px
              w-[80px]
              bg-zinc-200
            "
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Status */}

                        <motion.div
                            animate={{
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                            }}
                            className="
      absolute
      left-10
      bottom-10
      flex
      items-center
      gap-2
    "
                        >
                            <div className="h-2 w-2 rounded-full bg-green-500" />

                            <span
                                className="
        text-sm
        font-medium
        text-zinc-700
      "
                            >
                                124 projects currently active
                            </span>
                        </motion.div>

                        {/* Handwritten */}

                        <div
                            className="
      absolute
      right-8
      bottom-8
      rotate-[-5deg]
      font-handwriting
      text-xl
      text-blue-500/70
      select-none
    "
                        >
                            ship it →
                        </div>
                    </div>

                </div>

                <div className="absolute font-handwriting text-blue-600/60 text-xl hidden md:block" style={{ top: "40%", left: "5%" }}>
                    don't build alone
                </div>

            </div>
        </section>
    );
}
