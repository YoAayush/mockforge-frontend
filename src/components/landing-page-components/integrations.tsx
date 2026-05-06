"use client";

const integrations = [
  { name: "REST API", icon: "🔗", color: "bg-blue-500/20" },
  { name: "GraphQL", icon: "📊", color: "bg-pink-500/20" },
  { name: "WebSocket", icon: "🔄", color: "bg-purple-500/20" },
  { name: "OpenAPI", icon: "📖", color: "bg-orange-500/20" },
  { name: "Swagger", icon: "⚙️", color: "bg-green-500/20" },
  { name: "Postman", icon: "✉️", color: "bg-red-500/20" },
];

export function Integrations() {
  return (
    <section id="integrations" className="py-20 px-6 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Works With Your Stack
          </h2>
          <p className="text-secondary text-lg">
            Seamless integration with tools you already use
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="p-6 rounded-lg border border-default bg-background hover:border-accent transition-colors text-center"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-lg ${integration.color} flex items-center justify-center text-2xl`}
              >
                {integration.icon}
              </div>
              <p className="font-semibold text-primary">{integration.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-lg border border-accent/30 bg-accent/5 text-center">
          <p className="text-secondary mb-4">
            And many more. Our extensive API covers all major standards and
            formats.
          </p>
          <p className="text-sm text-secondary/70">
            Need a custom integration? We&apos;re just an email away.
          </p>
        </div>
      </div>
    </section>
  );
}
