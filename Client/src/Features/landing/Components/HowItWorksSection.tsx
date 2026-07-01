import { motion } from "framer-motion"

const steps = [
  {
    num: "01",
    title: "Idea",
    desc: "You have a concept, a hackathon topic, or a problem you want to solve. You define the stack and target goals."
  },
  {
    num: "02",
    title: "Find Builders",
    desc: "Publish your project page. PeerY indexes your needs and presents it to active developers who match your requirements."
  },
  {
    num: "03",
    title: "Match",
    desc: "Our compatibility engine runs behind the scenes. No swiping. We match based on commits, shared tech, and timezone alignment."
  },
  {
    num: "04",
    title: "Chat",
    desc: "Open direct, context-rich chat threads. PeerY integrates with Discord and Slack for seamless onboarding."
  },
  {
    num: "05",
    title: "Build & Ship",
    desc: "Deploy code. Push to main. Share the finished product with the community and show off what you built together."
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="space-y-4 mb-16">
        <span className="text-sm font-semibold tracking-wider text-blue-500 uppercase">Workflow</span>
        <h2 className="text-4xl font-bold tracking-tight">How PeerY Works</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col space-y-4 border-l border-zinc-800 pl-4 py-2 hover:border-zinc-500 transition-colors"
          >
            <span className="text-sm font-mono text-zinc-500">{step.num}</span>
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
