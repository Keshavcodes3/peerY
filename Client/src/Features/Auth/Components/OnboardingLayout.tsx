import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface OnboardingLayoutProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
    step: number;
    direction: number;
}

const LEFT_VARIANTS = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
};

const RIGHT_VARIANTS = {
    initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export function OnboardingLayout({ leftContent, rightContent, step, direction }: OnboardingLayoutProps) {
    return (
        <div className="flex w-full h-screen overflow-hidden bg-white text-zinc-900 font-sans selection:bg-blue-500/20">
            {/* Left Side - 60% - Experience */}
            <div className="hidden lg:flex lg:w-[60%] relative bg-zinc-50 border-r border-zinc-200 items-center justify-center p-12 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`left-${step}`}
                        variants={LEFT_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full flex items-center justify-center relative"
                    >
                        {leftContent}
                    </motion.div>
                </AnimatePresence>
                <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
            </div>

            {/* Right Side - 40% - Form */}
            <div className="w-full lg:w-[40%] flex flex-col relative overflow-y-auto">
                <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 max-w-2xl mx-auto w-full">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`right-${step}`}
                            custom={direction}
                            variants={RIGHT_VARIANTS}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full"
                        >
                            {rightContent}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
