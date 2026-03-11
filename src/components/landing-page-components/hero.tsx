import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export function Hero() {
    return (
        <section className="bg-slate-950 py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Build Mock APIs in Seconds, Not Hours
                </h1>

                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                    MockForge generates production-ready REST endpoints with deterministic mock data. Perfect for frontend developers, testers, and product teams who need instant APIs.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/signup">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
                            <Zap size={18} />
                            Start Building Free
                        </Button>
                    </Link>

                    <Button
                        size="lg"
                        variant="outline"
                        className="border-slate-700 text-black hover:bg-slate-900 hover:text-white"
                    >
                        View Demo
                    </Button>
                </div>
            </div>
        </section>
    )
}
