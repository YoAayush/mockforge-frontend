import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
    return (
        <section className="bg-slate-950 py-20 px-6 border-t border-slate-800">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Start building mock APIs instantly
                </h2>

                <p className="text-lg text-slate-300 mb-8">
                    Join developers who ship faster with MockForge.
                </p>

                <Link href="/auth/signup">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                        Get Started Free
                    </Button>
                </Link>
            </div>
        </section>
    )
}
