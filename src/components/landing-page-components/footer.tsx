export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-slate-950 border-t border-slate-800 py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
                <p className="text-slate-400 text-sm">
                    © {year} MockForge. Built for developers.
                </p>

                <div className="text-slate-500 text-sm mt-4 sm:mt-0">
                    Made with Emergent
                </div>
            </div>
        </footer>
    )
}
