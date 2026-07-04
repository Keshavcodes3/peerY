import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Small buffer to trigger transition
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const springTransition = {
    type: "spring" as const,
    stiffness: 320,
    damping: 30,
    mass: 0.8
  }

  const links = [
    { name: "Discover", href: "#discover" },
    { name: "Projects", href: "#projects" },
    { name: "Builders", href: "#builders" },
    { name: "Community", href: "#community" }
  ]

  return (
    <>
      {/* Outer wrapper to handle absolute positioning at center */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none p-4 md:p-6">
        <motion.header
          layout
          transition={springTransition}
          style={{
            borderRadius: isScrolled ? "9999px" : "0px"
          }}
          className={`pointer-events-auto flex items-center justify-between w-full ${
            isScrolled
              ? "max-w-3xl bg-white/70 backdrop-blur-xl border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-5 py-2"
              : "max-w-7xl bg-transparent border-transparent px-8 py-5"
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group pointer-events-auto">
            <motion.div 
              layout="position"
              className="relative flex items-center gap-1.5"
            >
              <div className="relative w-7 h-7 flex items-center justify-center">
                {/* Minimalist SVG Brand Mark */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-950">
                  <path d="M4 4H10C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 16H10C13.3137 16 16 18.6863 16 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="19" cy="5" r="2" className="fill-blue-600" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-950">
                PeerY
              </span>
            </motion.div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-500 hover:text-zinc-950 transition-colors py-1 relative group"
              >
                <motion.span layout="position">{link.name}</motion.span>
                <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-zinc-900 transition-all duration-300 -translate-x-1/2 group-hover:w-1/2" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <motion.div 
            layout="position"
            className="hidden md:flex items-center gap-4 text-sm font-medium"
          >
            <a 
              href="/login" 
              className="text-zinc-500 hover:text-zinc-950 transition-colors px-2 py-1"
            >
              Login
            </a>
            <Button 
              variant="default" 
              className={`rounded-full font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                isScrolled 
                  ? "h-8 px-4 text-xs bg-zinc-950 hover:bg-zinc-800" 
                  : "h-9 px-5 text-sm bg-zinc-950 hover:bg-zinc-800"
              }`}
            >
              <span>Start Building</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.header>
      </div>

      {/* Floating Mobile Menu Container */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-sm md:hidden">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-20 inset-x-4 bg-white border border-zinc-200 shadow-2xl rounded-2xl p-5 flex flex-col gap-5"
            >
              <div className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-zinc-600 hover:text-zinc-950 py-1 border-b border-zinc-50"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <hr className="border-zinc-100" />
              <div className="flex flex-col gap-3">
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 font-medium text-zinc-600 hover:text-zinc-950"
                >
                  Login
                </a>
                <Button 
                  className="w-full rounded-full py-5 bg-zinc-950 text-white hover:bg-zinc-800 flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Start Building</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
