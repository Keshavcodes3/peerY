export function CompletionView() {
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
          rotate-[-5deg]
        "
            >
                your journey starts now →
            </div>

            <div
                className="
          absolute
          bottom-24
          right-10
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[4deg]
        "
            >
                one connection changes everything ✦
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
          "
                >
                    BUILD
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
                    WELCOME TO PEERY
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
                    You're not joining
                    <br />
                    a platform.
                    <br />
                    You're joining a
                    <span className="text-blue-600">
                        {" "}network.
                    </span>
                </h2>

                <p
                    className="
            mt-10
            text-xl
            text-zinc-500
            max-w-2xl
            leading-relaxed
          "
                >
                    Thousands of builders are learning,
                    collaborating, shipping projects and
                    creating opportunities together.
                </p>

                {/* Mini Manifesto */}

                <div className="mt-14 space-y-4">

                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <p className="text-zinc-700">
                            Learn publicly
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <p className="text-zinc-700">
                            Build meaningful things
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <p className="text-zinc-700">
                            Find ambitious people
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <p className="text-zinc-700">
                            Create opportunities
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}