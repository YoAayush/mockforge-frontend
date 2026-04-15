import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
    return (
        <section className="py-20 px-6 border-t border-default">
            <div className="max-w-4xl mx-auto text-center">

                <h2 className="text-4xl font-bold text-primary mb-4">
                    Start building mock APIs instantly
                </h2>

                <p className="text-lg text-secondary mb-8">
                    Join developers who ship faster with MockForge.
                </p>

                <Link href="/auth/signup">
                    <Button
                        size="lg"
                        className="bg-[rgb(var(--accent))] text-white hover:opacity-90"
                    >
                        Get Started Free
                    </Button>
                </Link>

            </div>
        </section>
    )
}