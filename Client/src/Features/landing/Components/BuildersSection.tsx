

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import "swiper/css";

const builders = [
  {
    handle: "mitch_g",
    role: "Systems Engineer",
    lookingFor: "Frontend Developer",
    project: "eBPF Network Visualizer",
    description:
      "Building a modern network inspection platform powered by Rust and eBPF.",
    skills: ["Rust", "Linux", "eBPF", "Go"],
    active: true,
    joined: 2,
  },
  {
    handle: "jess_code",
    role: "Fullstack Architect",
    lookingFor: "Systems Developer",
    project: "Collaborative Terminal Editor",
    description:
      "A local-first editor powered by CRDTs, Wasm and distributed syncing.",
    skills: ["TypeScript", "Wasm", "CRDT", "Neovim"],
    active: true,
    joined: 4,
  },
  {
    handle: "hacker_b",
    role: "ML Researcher",
    lookingFor: "Platform Engineer",
    project: "Distributed LLM Infrastructure",
    description:
      "Building orchestration tools for large-scale training clusters.",
    skills: ["Python", "CUDA", "Kubernetes", "PyTorch"],
    active: false,
    joined: 3,
  },
];

export function BuildersSection() {
  return (
    <section
      id="builders"
      className="relative overflow-hidden border-t border-zinc-900 py-32"
    >
      {/* handwritten notes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 0.6, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute left-20 top-20 hidden rotate-[-6deg] text-sm font-light italic text-zinc-500 lg:block"
      >
        found my backend dev here →
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 0.6, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-24 right-20 hidden rotate-[4deg] text-sm font-light italic text-zinc-500 lg:block"
      >
        weekend build team
      </motion.div>

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
              Live Requests
            </span>
          </div>

          <h2 className="max-w-3xl text-5xl font-bold tracking-tight text-white">
            Builders looking for teammates right now.
          </h2>

          <p className="mt-4 max-w-xl text-zinc-400">
            Real projects. Real developers. No networking theater.
          </p>
        </motion.div>

        <Swiper
          slidesPerView={1.15}
          spaceBetween={24}
          mousewheel
          modules={[Mousewheel]}
          breakpoints={{
            768: {
              slidesPerView: 2.1,
            },
            1280: {
              slidesPerView: 3.2,
            },
          }}
        >
          {builders.map((builder, index) => (
            <SwiperSlide key={builder.handle}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Card className="group h-[430px] border-zinc-800 bg-zinc-950/80 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700">
                  <CardContent className="flex h-full flex-col p-7">
                    {/* top */}
                    <div className="mb-8 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        @{builder.handle}
                      </span>

                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={
                            builder.active
                              ? {
                                scale: [1, 1.4, 1],
                              }
                              : {}
                          }
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                          }}
                          className={`h-2 w-2 rounded-full ${builder.active
                            ? "bg-emerald-500"
                            : "bg-zinc-600"
                            }`}
                        />
                        <span className="text-xs text-zinc-500">
                          {builder.active ? "Active now" : "Recently active"}
                        </span>
                      </div>
                    </div>

                    {/* looking for */}
                    <div className="mb-8">
                      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-zinc-600">
                        Looking For
                      </p>

                      <h3 className="text-3xl font-semibold leading-tight text-white">
                        {builder.lookingFor}
                      </h3>
                    </div>

                    {/* project */}
                    <div className="mb-6">
                      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-zinc-600">
                        Building
                      </p>

                      <h4 className="mb-3 text-lg font-medium text-zinc-100">
                        {builder.project}
                      </h4>

                      <p className="leading-relaxed text-zinc-400">
                        {builder.description}
                      </p>
                    </div>

                    {/* skills */}
                    <div className="mb-8 flex flex-wrap gap-2">
                      {builder.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-auto border-t border-zinc-900 pt-6">
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                          {builder.joined} builders joined
                        </span>

                        <span className="font-mono text-sm text-blue-400">
                          92% match
                        </span>
                      </div>

                      <button className="group/button flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-all hover:border-zinc-700">
                        <span className="text-sm font-medium">
                          View Project
                        </span>

                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}