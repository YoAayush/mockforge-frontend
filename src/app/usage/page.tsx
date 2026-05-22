"use client";

import { Copy, Check, Code, Zap, BookOpen, Layers } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/landing-page-components/header";
import { toast } from "sonner";
import { Footer } from "@/components/landing-page-components/footer";

export default function UsagePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code snippet copied to clipboard!", {
      description: "You can now paste it in your project.",
      action: {
        label: "Close",
        onClick: () => console.log("Close toast"),
      },
    });
    // setTimeout(() => setCopiedCode(null), 2000)
  };

  const codeExamples = [
    {
      id: "fetch-all",
      title: "Fetch All Records",
      language: "javascript",
      code: `const response = await fetch('/api/mock/your-project-id/user');
const users = await response.json();
console.log(users);`,
    },
    {
      id: "fetch-single",
      title: "Fetch Single Record",
      language: "javascript",
      code: `const response = await fetch('/api/mock/your-project-id/user/1');
const user = await response.json();
console.log(user);`,
    },
    {
      id: "create-record",
      title: "Create New Record",
      language: "javascript",
      code: `const response = await fetch('/api/mock/your-project-id/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe'
  })
});
const newUser = await response.json();
console.log(newUser);`,
    },
    {
      id: "update-record",
      title: "Update Record",
      language: "javascript",
      code: `const response = await fetch('/api/mock/your-project-id/user/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newemail@example.com',
    name: 'Jane Doe'
  })
});
const updatedUser = await response.json();
console.log(updatedUser);`,
    },
    {
      id: "delete-record",
      title: "Delete Record",
      language: "javascript",
      code: `const response = await fetch('/api/mock/your-project-id/user/1', {
  method: 'DELETE'
});
const result = await response.json();
console.log('User deleted:', result);`,
    },
    {
      id: "curl-example",
      title: "Using cURL",
      language: "bash",
      code: `# Get all users
curl https://mockforge-frontend.vercel.app/api/mock/your-project-id/user

# Get single user
curl https://mockforge-frontend.vercel.app/api/mock/your-project-id/user/1

# Create user
curl -X POST https://mockforge-frontend.vercel.app/api/mock/your-project-id/user \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","name":"John Doe"}'`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="px-8 py-20 border-b border-slate-800 ">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400">
            Getting Started
          </div>
          <h1 className="text-5xl font-bold mb-4 text-primary text-pretty">
            Build with MockForge
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl">
            Create realistic mock APIs in minutes. No backend needed. Generate
            test data, define schemas, and test your applications with
            auto-generated REST endpoints.
          </p>
          <div className="flex gap-4">
            <Link
              href="/documentation"
              className="border-2 border-border text-secondary hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              View Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Why Choose MockForge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Generate mock APIs instantly without any backend setup or deployment",
              },
              {
                icon: Layers,
                title: "Flexible Schemas",
                description:
                  "Define complex data models with custom fields, types, and faker generators",
              },
              {
                icon: Code,
                title: "REST API Ready",
                description:
                  "Auto-generated REST endpoints for all CRUD operations on your schemas",
              },
              {
                icon: BookOpen,
                title: "Interactive Playground",
                description:
                  "Test your APIs directly in the browser with the built-in API playground",
              },
              {
                icon: Copy,
                title: "Easy Integration",
                description:
                  "Simple HTTP calls - use with any language or framework",
              },
              {
                icon: Check,
                title: "Realistic Data",
                description:
                  "Auto-generate realistic test data using Faker generators",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-secondary border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
                >
                  <Icon className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Quick Start in 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Define Your Schema",
                description:
                  "Create a data model by defining fields and their types. Add custom faker generators for realistic test data.",
              },
              {
                step: "2",
                title: "Generate Endpoints",
                description:
                  "MockForge automatically generates REST API endpoints for all CRUD operations based on your schema.",
              },
              {
                step: "3",
                title: "Start Building",
                description:
                  "Use the auto-generated API endpoints in your application. No backend needed!",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="absolute -left-4 -top-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                  {item.step}
                </div>
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 pl-8">
                  <h3 className="font-semibold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Examples Section */}
      <div className="px-8 py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-primary">
            Usage Examples
          </h2>
          <div className="space-y-6">
            {codeExamples.map((example) => (
              <div
                key={example.id}
                className="bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden"
              >
                <div className="bg-secondary px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-secondary">
                    {example.title}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(example.code, example.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs rounded border border-border text-secondary hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
                  >
                    {copiedCode === example.id ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-tertiary p-6 overflow-x-auto">
                  <pre className="font-mono text-sm text-secondary whitespace-pre-wrap break-words">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-primary">
            Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Organize by Resource",
                description:
                  "Create separate schemas for each resource type (users, products, orders, etc.) to keep your API organized.",
              },
              {
                title: "Use Realistic Data",
                description:
                  "Leverage faker generators to create realistic test data that matches your production data format.",
              },
              {
                title: "Version Your Schemas",
                description:
                  "Keep track of schema versions to manage changes and maintain backwards compatibility.",
              },
              {
                title: "Set Record Limits",
                description:
                  "Configure appropriate record limits to prevent accidental generation of massive datasets.",
              },
              {
                title: "Test Thoroughly",
                description:
                  "Use the API Playground to test all endpoints before using them in your application.",
              },
              {
                title: "Document Your API",
                description:
                  "Add descriptions to your schemas and fields to help your team understand the API structure.",
              },
            ].map((practice) => (
              <div
                key={practice.title}
                className="bg-tertiary border border-slate-700 rounded-lg p-6"
              >
                <h3 className="font-semibold text-primary mb-2">
                  {practice.title}
                </h3>
                <p className="text-secondary text-sm">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
