import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "I finally found people who actually want to build. No endless planning, no vaporware. Just shipping code.",
    author: "dev_mitch",
    project: "Matched on KubeDeck"
  },
  {
    quote: "We launched on Product Hunt 3 weeks after matching. The compatibility scoring saved us months of searching.",
    author: "sarah_t",
    project: "Matched on Braid"
  },
  {
    quote: "No endless coffee chats. Just code. Within 2 hours of matching, we had initialized our repository and pushed the first commit.",
    author: "rust_ace",
    project: "Matched on VaporSearch"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="space-y-4 mb-16 text-center">
        <span className="text-sm font-semibold tracking-wider text-blue-500 uppercase font-mono font-bold">Feedback</span>
        <h2 className="text-4xl font-bold tracking-tight">Built with teammates found on PeerY</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="space-y-4 flex flex-col justify-between"
          >
            <p className="text-lg text-zinc-300 italic font-light leading-relaxed">
              "{t.quote}"
            </p>
            <div className="pt-4">
              <p className="text-sm font-bold text-white">@{t.author}</p>
              <p className="text-xs text-zinc-500">{t.project}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
