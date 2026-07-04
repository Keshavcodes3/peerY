import { motion } from "framer-motion"
import StickyWorkspace from "../ProblemSection/StickyWorkspace"
export function ProblemSection() {

  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              02 / CONNECTIONS CREATE OPPORTUNITIES
            </span>

            <h2 className="mt-6 text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]">
              One conversation.
              <br />
              One project.
              <br />
              <span className="text-blue-600">
                One opportunity.
              </span>
            </h2>

            <p className="mt-8 text-xl text-zinc-500 max-w-2xl">
              The best opportunities don't come from another course.
              They come from the people you meet while learning,
              building and growing.
            </p>
          </motion.div>
        </div>
      </section>

      <StickyWorkspace />
    </>
  )
}
