export function EvolutionView() {
    return (
        <div className="relative h-full flex items-center px-16 overflow-hidden">

            {/* Handwritten */}

            <div
                className="
          absolute
          top-20
          right-12
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[-5deg]
        "
            >
                nobody starts as an expert →
            </div>

            <div
                className="
          absolute
          bottom-24
          left-12
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[4deg]
        "
            >
                just keep showing up
            </div>

            {/* Background Word */}

            <div
                className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
          select-none
        "
            >
                <span
                    className="
            text-[220px]
            font-black
            tracking-tight
            text-zinc-50
            leading-none
          "
                >
                    GROW
                </span>
            </div>

            {/* Main Content */}

            <div className="relative z-10 max-w-4xl">

                <p
                    className="
            uppercase
            tracking-[0.35em]
            text-xs
            text-zinc-400
          "
                >
                    EXPERIENCE
                </p>

                <h2
                    className="
            mt-6
            text-7xl
            font-bold
            leading-[0.9]
            tracking-tight
          "
                >
                    Every expert
                    <br />
                    was once a
                    <br />
                    <span className="text-blue-600">
                        beginner.
                    </span>
                </h2>

                <p
                    className="
            mt-10
            text-xl
            text-zinc-500
            max-w-xl
            leading-relaxed
          "
                >
                    PeerY isn't about where you are today.
                    It's about where you'll be after building
                    consistently with the right people.
                </p>

                {/* Evolution Line */}

                <div className="mt-16 flex items-center gap-6">

                    <span className="text-zinc-400 font-medium">
                        Beginner
                    </span>

                    <div className="h-px flex-1 bg-zinc-200" />

                    <span className="text-zinc-400 font-medium">
                        Intermediate
                    </span>

                    <div className="h-px flex-1 bg-zinc-200" />

                    <span className="text-blue-600 font-semibold">
                        Advanced
                    </span>

                </div>

            </div>
        </div>
    )
}