export function ConnectionView() {
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
                everyone arrives differently →
            </div>

            <div
                className="
          absolute
          bottom-24
          right-12
          font-handwriting
          text-blue-500/60
          text-2xl
          rotate-[4deg]
        "
            >
                but nobody grows alone
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
            text-zinc-50
            tracking-tight
            leading-none
          "
                >
                    BELONG
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
                    INTENT
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
                    Not everyone
                    <br />
                    joins for the
                    <br />
                    <span className="text-blue-600">
                        same reason.
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
                    Some people want to learn.
                    Some want teammates.
                    Some want internships.
                    Others want to build the next big thing.
                </p>

                <p
                    className="
            mt-6
            text-xl
            font-medium
            text-zinc-900
          "
                >
                    The important part is that you're here.
                </p>

            </div>

        </div>
    )
}