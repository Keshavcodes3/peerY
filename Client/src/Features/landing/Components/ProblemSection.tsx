import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { X, Check, ArrowRight } from "lucide-react"
import StickyWorkspace from "../ProblemSection/StickyWorkspace"
const TRANSFORMATIONS = [
  {
    old: { title: "Learn Alone", desc: "Watch tutorials. Feel lost." },
    new: { title: "Learn Together", desc: "Roadmaps, AI guidance, peers." },
  },
  {
    old: { title: "Build Alone", desc: "Half-finished side projects." },
    new: { title: "Build Together", desc: "Real products. Real teammates." },
  },
  {
    old: { title: "Get Stuck", desc: "No one to ask." },
    new: { title: "Ask Peers", desc: "Community support and mentorship." },
  },
  {
    old: { title: "Quit", desc: "Motivation disappears." },
    new: { title: "Stay Consistent", desc: "Build streaks and accountability." },
  },
  {
    old: { title: "Consume Content", desc: "Another tutorial." },
    new: { title: "Ship Products", desc: "Real experience." },
  },
]

export function ProblemSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

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
