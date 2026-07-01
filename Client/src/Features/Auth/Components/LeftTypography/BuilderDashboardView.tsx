export function BuilderDashboardView() {
    return (
        <div className="relative h-full flex items-center px-16 overflow-hidden">

            {/* Handwritten */}

            <div
                className="
          absolute
          top-20
          right-10
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[-5deg]
        "
            >
                everybody brings something →
            </div>

            <div
                className="
          absolute
          bottom-24
          left-10
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[4deg]
        "
            >
                yours is valuable too
            </div>

            {/* Background */}

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
          "
                >
                    VALUE
                </span>
            </div>

            {/* Main */}

            <div className="relative z-10 max-w-4xl">

                <p
                    className="
            uppercase
            tracking-[0.35em]
            text-xs
            text-zinc-400
          "
                >
                    SKILLS
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
                    Skills open
                    <br />
                    doors.
                    <br />
                    <span className="text-blue-600">
                        Consistency opens more.
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
                    Whether you're great at frontend,
                    backend, design, AI, DevOps or writing,
                    every project needs people who can
                    contribute something meaningful.
                </p>

            </div>
        </div>
    )
}