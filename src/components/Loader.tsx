export default function Loader({
    message,
}: {
    message?: string;
}) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-primary text-primary px-4">
            <div className="flex flex-col items-center justify-center gap-6 text-center">

                {/* Spinner */}
                <div className="relative h-12 w-12 sm:h-14 sm:w-14">

                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[rgb(var(--accent))] border-r-[rgb(var(--accent))]" />

                    {/* Inner subtle circle */}
                    <div className="absolute inset-2 rounded-full bg-secondary" />
                </div>

                {/* Text */}
                <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide text-secondary animate-pulse">
                    {message || "Loading..."}
                </p>
            </div>
        </div>
    )
}