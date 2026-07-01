import { motion } from "framer-motion"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    title: "KubeDeck",
    tagline: "Stream Deck control interface for Kubernetes clusters.",
    contributors: ["alex_dev", "k8s_guru"],
    tech: ["Go", "React", "WebSockets"],
    stars: 342,
  },
  {
    title: "Braid",
    tagline: "Decentralized code review assistant and git hooks orchestrator.",
    contributors: ["sarah_t", "code_flow", "diff_master"],
    tech: ["Rust", "TypeScript", "Wasm"],
    stars: 1205,
  },
  {
    title: "VaporSearch",
    tagline: "Sub-millisecond local markdown search engine with zero dependencies.",
    contributors: ["rust_ace", "docs_guy"],
    tech: ["Rust", "C++", "Python"],
    stars: 843,
  }
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4">
          <span className="text-sm font-semibold tracking-wider text-blue-500 uppercase font-mono">Shipped on PeerY</span>
          <h2 className="text-4xl font-bold tracking-tight">Real projects built by matched teams.</h2>
        </div>
        <p className="text-zinc-400 max-w-sm text-sm">
          These aren't boilerplate templates. They are production-ready developer tools built over weekends and hackathons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="h-full bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors group cursor-pointer">
              <CardContent className="p-6 flex flex-col h-full justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{project.tagline}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">Builders:</span>
                    <div className="flex gap-1.5">
                      {project.contributors.map((c, i) => (
                        <span key={i} className="text-xs text-zinc-300 hover:underline">
                          @{c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, i) => (
                      <Badge key={i} variant="outline" className="border-zinc-800 text-zinc-400 text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
