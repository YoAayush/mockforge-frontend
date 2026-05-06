"use client";

import { Zap, TestTube, Presentation, Clock } from "lucide-react";

const useCases = [
  {
    icon: Zap,
    title: "Frontend Development",
    description:
      "Build and test UI components without waiting for backend APIs. Work independently and boost productivity.",
  },
  {
    icon: TestTube,
    title: "Testing & QA",
    description:
      "Consistent, reproducible test data with seed control. Perfect for automated testing and CI/CD pipelines.",
  },
  {
    icon: Presentation,
    title: "Product Demos",
    description:
      "Instantly create compelling demos for stakeholders. Show features before backend implementation is done.",
  },
  {
    icon: Clock,
    title: "Rapid Prototyping",
    description:
      "Validate ideas quickly without infrastructure overhead. Ship prototypes in hours, not weeks.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-20 px-6 border-t border-default">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Perfect For Every Stage
          </h2>
          <p className="text-secondary text-lg">
            From prototyping to production, MockForge fits your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="p-6 rounded-lg border border-default bg-secondary hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
              >
                <Icon className="text-accent mb-4" size={32} />
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {useCase.title}
                </h3>
                <p className="text-secondary">{useCase.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
