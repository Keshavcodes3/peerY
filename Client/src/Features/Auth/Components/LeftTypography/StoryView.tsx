import { motion } from "framer-motion"

export function StoryView() {
    return (
        <div className="relative h-full flex items-center px-12 overflow-hidden">

            {/* Handwritten Notes */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.55, y: 0 }}
                transition={{ delay: 1 }}
                className="
          absolute
          top-20
          left-10
          font-handwriting
          text-blue-500
          text-2xl
          rotate-[-5deg]
        "
            >
                your next teammate might be here →
            </motion.div>

            <motion.div
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 6,
                }}
                className="
          absolute
          bottom-20
          right-16
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[4deg]
        "
            >
                one message changes everything
            </motion.div>

            {/* Main Content */}

            <div className="relative z-10 max-w-2xl">

                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="
            uppercase
            tracking-[0.3em]
            text-xs
            text-zinc-400
          "
                >
                    BUILDER STORY
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="
            mt-6
            text-7xl
            leading-[0.9]
            font-bold
            tracking-tight
          "
                >
                    Meet people
                    <br />
                    worth
                    <span className="text-blue-600"> building </span>
                    with.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="
            mt-8
            text-xl
            text-zinc-500
            leading-relaxed
            max-w-xl
          "
                >
                    Learn together.
                    Build together.
                    Ship together.
                    Grow with ambitious developers who are
                    trying to create something meaningful.
                </motion.p>

            </div>

            {/* Floating Words */}

            {[
                {
                    text: "React",
                    pos: "top-[18%] right-[18%]",
                },
                {
                    text: "Open Source",
                    pos: "top-[35%] right-[5%]",
                },
                {
                    text: "Co-Founder",
                    pos: "bottom-[28%] right-[10%]",
                },
                {
                    text: "Build",
                    pos: "bottom-[15%] left-[5%]",
                },
            ].map((item, i) => (
                <motion.div
                    key={item.text}
                    animate={{
                        y: [0, -12, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 4 + i,
                        delay: i * 0.3,
                    }}
                    className={`
            absolute
            ${item.pos}
            px-4
            py-2
            rounded-full
            border
            border-zinc-200
            bg-white
            text-sm
            font-medium
            text-zinc-600
            shadow-sm
          `}
                >
                    {item.text}
                </motion.div>
            ))}

            {/* Huge Background Word */}

            <div
                className="
          absolute
          right-[-120px]
          top-1/2
          -translate-y-1/2
          text-[220px]
          font-black
          text-zinc-50
          select-none
          pointer-events-none
          leading-none
        "
            >
                PEERY
            </div>

        </div>
    )
}