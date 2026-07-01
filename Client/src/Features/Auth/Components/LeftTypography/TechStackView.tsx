export function TechStackView() {
    return (
        <div className="relative h-full flex items-center px-16 overflow-hidden">

            {/* Handwritten */}

            <div
                className="
          absolute
          top-20
          left-10
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[-4deg]
        "
            >
                every builder has a toolkit →
            </div>

            <div
                className="
          absolute
          bottom-24
          right-10
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[5deg]
        "
            >
                tools change. builders don't.
            </div>

            {/* Giant Background */}

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
            text-zinc-50
            tracking-tight
          "
                >
                    STACK
                </span>
            </div>

            {/* Content */}

            <div className="relative z-10 max-w-4xl">

                <p
                    className="
            uppercase
            tracking-[0.35em]
            text-xs
            text-zinc-400
          "
                >
                    TECH STACK
                </p>

                <h2
                    className="
            mt-6
            text-7xl
            font-bold
            tracking-tight
            leading-[0.9]
          "
                >
                    Your tools
                    <br />
                    shape the way
                    <br />
                    you
                    <span className="text-blue-600">
                        {" "}build.
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
                    Whether it's React, Rust, Go,
                    Python or something entirely different,
                    every stack is simply another way
                    to bring ideas to life.
                </p>

            </div>

        </div>
    )
}