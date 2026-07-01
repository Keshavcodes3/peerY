import { Navbar } from "./Components/Navbar"
import { HeroSection } from "./Components/HeroSection"
import { ProblemSection } from "./Components/ProblemSection"
import EcosystemSection from "./Components/EcosystemSection"
import { Footer } from "./Components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-500/20 grid-bg relative">
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <EcosystemSection />
      </main>
      <Footer />
    </div>
  )
}

