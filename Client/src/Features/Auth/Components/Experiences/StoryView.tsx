import { motion } from "framer-motion";

export function StoryView() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center space-y-4 w-full">
                
                <motion.div variants={item} className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-zinc-200 w-full text-center">
                    <span className="font-display font-semibold text-lg">Keshav</span>
                </motion.div>

                <motion.div variants={item} className="h-6 w-[2px] bg-zinc-200 rounded-full" />

                <motion.div variants={item} className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-zinc-200 w-full text-center">
                    <span className="text-zinc-600 font-medium">Looking for teammates</span>
                </motion.div>

                <motion.div variants={item} className="h-6 w-[2px] bg-zinc-200 rounded-full" />

                <motion.div variants={item} className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-zinc-200 w-full text-center">
                    <span className="font-display font-semibold text-lg">Met Arjun</span>
                </motion.div>

                <motion.div variants={item} className="h-6 w-[2px] bg-zinc-200 rounded-full" />

                <motion.div variants={item} className="bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-lg border border-zinc-800 w-full text-center relative overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.4 }}
                        className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"
                    />
                    <span className="font-display font-semibold text-lg relative z-10">Shipped ResumeAI</span>
                </motion.div>

            </motion.div>

            <motion.div 
                initial={{ opacity: 0, rotate: -3 }}
                animate={{ opacity: 1, rotate: -6 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="absolute bottom-16 right-12 text-blue-600 font-handwriting text-2xl max-w-[200px]"
            >
                every builder starts somewhere →
            </motion.div>
        </div>
    );
}
