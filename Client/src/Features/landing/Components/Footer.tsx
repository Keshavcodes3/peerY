
export function Footer() {
    return (
        <footer className="relative border-t border-zinc-200 bg-white overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 py-32">

                <div className="max-w-3xl">

                    <span
                        className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          font-bold
          text-blue-600
        "
                    >
                        READY TO BUILD?
                    </span>

                    <h2
                        className="
          mt-6
          text-6xl
          md:text-7xl
          font-black
          tracking-[-0.06em]
          leading-[0.95]
          text-zinc-950
        "
                    >
                        Find people.
                        <br />
                        Learn together.
                        <br />
                        <span className="text-blue-600">
                            Ship faster.
                        </span>
                    </h2>

                    <p
                        className="
          mt-8
          max-w-lg
          text-lg
          text-zinc-500
          leading-relaxed
        "
                    >
                        Join developers learning,
                        building and growing together.
                    </p>

                    <button
                        className="
          mt-10
          h-12
          px-6
          rounded-xl
          bg-blue-600
          text-white
          font-medium
          hover:bg-blue-700
          transition-colors
        "
                    >
                        Join PeerY
                    </button>

                </div>
                <div className="mt-20 flex flex-wrap gap-8">

                    <a
                        href="#"
                        className="
      text-2xl
      font-black
      tracking-tight
      text-zinc-300
      hover:text-zinc-950
      transition-colors
    "
                    >
                        Github
                    </a>

                    <a
                        href="#"
                        className="
      text-2xl
      font-black
      tracking-tight
      text-zinc-300
      hover:text-blue-600
      transition-colors
    "
                    >
                        Twitter
                    </a>

                    <a
                        href="#"
                        className="
      text-2xl
      font-black
      tracking-tight
      text-zinc-300
      hover:text-blue-600
      transition-colors
    "
                    >
                        Discord
                    </a>

                </div>
            </div>

        </footer>
    );
}
