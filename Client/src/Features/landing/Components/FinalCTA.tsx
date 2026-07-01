import { Button } from "../../../components/ui/button"

export function FinalCTA() {
  return (
    <section className="py-32 px-6 border-t border-zinc-900 text-center max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
        Build together. Ship together.
      </h2>
      <p className="text-lg text-zinc-400 max-w-md mx-auto">
        Stop building alone. Find developers who share your stack, your timezone, and your drive.
      </p>
      <div className="pt-4">
        <Button size="lg" className="rounded-full text-base font-semibold px-8 h-12 bg-white text-black hover:bg-zinc-200 shadow-lg">
          Start Building Now
        </Button>
      </div>
    </section>
  )
}
