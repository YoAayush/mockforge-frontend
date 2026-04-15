export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-default py-8 px-6">
            <div className="max-w-6xl mx-auto flex sm:flex-row items-center justify-center">

                <p className="text-secondary text-sm">
                    © {year} MockForge. Built for developers.
                </p>

                {/* 
                <div className="text-tertiary text-sm mt-4 sm:mt-0">
                    Made with Emergent
                </div> 
                */}
            </div>
        </footer>
    )
}