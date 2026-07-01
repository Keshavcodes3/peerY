export function ProfileBuildView() {
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
          rotate-[-6deg]
        "
            >
                your internet identity →
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
                make it count
            </div>

            {/* Huge Background Word */}

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
                    YOU
                </span>
            </div>

            {/* Content */}

            <div className="relative z-10 max-w-3xl">

                <p
                    className="
            uppercase
            tracking-[0.35em]
            text-xs
            text-zinc-400
          "
                >
                    IDENTITY
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
                    Before the
                    <br />
                    projects.
                    <br />
                    Before the
                    <span className="text-blue-600">
                        {" "}connections.
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
                    People will remember your name
                    before they remember your code.
                </p>

            </div>
        </div>
    )
}