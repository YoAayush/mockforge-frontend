import { Database, Code2, PlayCircle } from 'lucide-react'

const features = [
    {
        icon: Database,
        title: 'Schema-First Design',
        description: 'Define your data model once. Get REST endpoints, mock data, and a full API playground automatically.',
    },
    {
        icon: Code2,
        title: 'Deterministic Data',
        description: 'Reproducible mock data with seed control. Perfect for consistent testing and demos.',
    },
    {
        icon: PlayCircle,
        title: 'Built-in Playground',
        description: 'Test your endpoints instantly with our Postman-like API playground. No external tools needed.',
    },
]

export function Features() {
    return (
        <section className="py-20 px-6 border-t border-default">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-primary text-center mb-16">
                    Why MockForge?
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.title}
                                className="p-6 rounded-lg border border-default bg-secondary hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
                            >
                                <Icon className="text-accent mb-4" size={32} />

                                <h3 className="text-xl font-semibold text-primary mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-secondary">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
