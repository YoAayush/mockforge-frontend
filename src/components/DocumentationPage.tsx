'use client'

import { Copy, Check, ChevronRight, Code2, Database, Zap, Shield, Layers } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Header } from './landing-page-components/header'

export function DocumentationPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [expandedSection, setExpandedSection] = useState<string | null>('schemas')

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id)
        alert("Copied to clipboard!");
        setTimeout(() => setCopiedCode(null), 2000)
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Header */}
            <div className="px-8 py-12 border-b border-slate-800 from-slate-900 to-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/usage" className="text-slate-400 hover:text-slate-300 flex items-center gap-1">
                            Usage Guide
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                        <span className="text-primary">Documentation</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 text-primary">Documentation</h1>
                    <p className="text-secondary text-lg">Complete guide to using MockForge API and features</p>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-2">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Documentation</h3>
                            {[
                                { id: 'schemas', label: 'Schemas', icon: Database },
                                { id: 'endpoints', label: 'API Endpoints', icon: Zap },
                                { id: 'authentication', label: 'Authentication', icon: Shield },
                                { id: 'fields', label: 'Field Types', icon: Layers },
                                { id: 'errors', label: 'Error Handling', icon: Code2 }
                            ].map((item) => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setExpandedSection(expandedSection === item.id ? null : item.id)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${expandedSection === item.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-secondary hover:text-slate-300 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Schemas Section */}
                        {expandedSection === 'schemas' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-primary">Schemas</h2>
                                    <p className="text-secondary mb-6">
                                        Schemas define the structure of your data. Each schema represents a data model with fields that define the properties of your resources.
                                    </p>

                                    <div className="bg-tertiary border border-border rounded-lg p-6 space-y-4">
                                        <h3 className="font-semibold text-primary">Creating a Schema</h3>
                                        <ol className="space-y-3 text-secondary list-decimal list-inside">
                                            <li>Navigate to the Schemas section from the sidebar</li>
                                            <li>Click the "New Schema" button</li>
                                            <li>Enter your schema name (e.g., "User", "Product")</li>
                                            <li>Add fields by clicking "Add Field"</li>
                                            <li>Configure each field with name, type, and faker generator</li>
                                            <li>Click "Update Schema" to save</li>
                                        </ol>
                                    </div>

                                    <div className="bg-tertiary border border-border rounded-lg p-6 mt-6">
                                        <h3 className="font-semibold text-primary mb-4">Example Schema Definition</h3>
                                        <div className="bg-secondary rounded p-4 overflow-x-auto">
                                            <pre className="font-mono text-sm text-secondary">
                                                {`{
  "name": "User",
  "version": 1,
  "seed": 1,
  "defaultCount": 15,
  "recordLimit": 100,
  "fields": {
    "email": {
      "type": "email",
      "faker_type": null
    },
    "name": {
      "type": "string",
      "faker_type": null
    }
  }
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* API Endpoints Section */}
                        {expandedSection === 'endpoints' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-primary">API Endpoints</h2>
                                    <p className="text-secondary mb-6">
                                        MockForge automatically generates REST API endpoints for your schemas. Each schema gets a complete set of CRUD endpoints.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                method: 'GET',
                                                path: '/api/mock/{projectId}/{resource}',
                                                description: 'Get all records',
                                                color: 'text-blue-400'
                                            },
                                            {
                                                method: 'GET',
                                                path: '/api/mock/{projectId}/{resource}/{id}',
                                                description: 'Get single record by ID',
                                                color: 'text-blue-400'
                                            },
                                            {
                                                method: 'POST',
                                                path: '/api/mock/{projectId}/{resource}',
                                                description: 'Create new record',
                                                color: 'text-green-400'
                                            },
                                            {
                                                method: 'PUT',
                                                path: '/api/mock/{projectId}/{resource}/{id}',
                                                description: 'Update record',
                                                color: 'text-yellow-400'
                                            },
                                            {
                                                method: 'DELETE',
                                                path: '/api/mock/{projectId}/{resource}/{id}',
                                                description: 'Delete record',
                                                color: 'text-red-400'
                                            }
                                        ].map((endpoint, idx) => (
                                            <div key={idx} className="bg-tertiary border border-border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className={`font-mono font-semibold text-sm ${endpoint.color}`}>{endpoint.method}</span>
                                                    <span className="text-secondary text-sm">{endpoint.description}</span>
                                                </div>
                                                <code className="text-secondary font-mono text-sm">{endpoint.path}</code>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Authentication Section */}
                        {expandedSection === 'authentication' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-primary">Authentication</h2>
                                    <p className="text-secondary mb-6">
                                        MockForge API endpoints are currently accessible without authentication. Project IDs are treated as public API keys.
                                    </p>

                                    <div className="bg-tertiary border border-border rounded-lg p-6">
                                        <h3 className="font-semibold text-primary mb-4">Making Authenticated Requests</h3>
                                        <div className="bg-secondary rounded p-4 overflow-x-auto mb-4">
                                            <pre className="font-mono text-sm text-secondary">
                                                {`// JavaScript with fetch
const projectId = 'your-project-id';
const response = await fetch(\`/api/mock/\${projectId}/user\`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});`}
                                            </pre>
                                        </div>
                                        <p className="text-slate-400 text-sm">
                                            Your Project ID is available in the project dashboard and is required for all API requests.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Field Types Section */}
                        {expandedSection === 'fields' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-primary">Field Types</h2>
                                    <p className="text-secondary mb-6">
                                        MockForge supports various field types for your schemas. Each type can be paired with faker generators for realistic test data.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            { type: 'string', description: 'Text values of any length' },
                                            { type: 'email', description: 'Valid email addresses' },
                                            { type: 'number', description: 'Numeric values (integers and decimals)' },
                                            { type: 'boolean', description: 'True or false values' },
                                            { type: 'date', description: 'Date values in ISO 8601 format' },
                                            { type: 'uuid', description: 'Universally unique identifiers' }
                                        ].map((field, idx) => (
                                            <div key={idx} className="bg-tertiary border border-border rounded-lg p-4">
                                                <h4 className="font-mono font-semibold text-blue-400 mb-1">{field.type}</h4>
                                                <p className="text-secondary text-sm">{field.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Handling Section */}
                        {expandedSection === 'errors' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4 text-primary">Error Handling</h2>
                                    <p className="text-secondary mb-6">
                                        MockForge returns standard HTTP status codes to indicate the success or failure of requests.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            { code: '200', message: 'OK', description: 'Request successful' },
                                            { code: '201', message: 'Created', description: 'Resource created successfully' },
                                            { code: '400', message: 'Bad Request', description: 'Invalid request parameters' },
                                            { code: '404', message: 'Not Found', description: 'Resource not found' },
                                            { code: '500', message: 'Internal Server Error', description: 'Server error occurred' }
                                        ].map((error, idx) => (
                                            <div key={idx} className="bg-tertiary border border-border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="font-mono font-semibold text-yellow-400">{error.code}</span>
                                                    <span className="font-semibold text-secondary">{error.message}</span>
                                                </div>
                                                <p className="text-secondary text-sm">{error.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-tertiary border border-border rounded-lg p-6 mt-6">
                                        <h3 className="font-semibold text-primary mb-4">Error Response Format</h3>
                                        <div className="bg-secondary rounded p-4 overflow-x-auto">
                                            <pre className="font-mono text-sm text-secondary">
                                                {`{
  "error": true,
  "message": "Invalid request parameters",
  "code": "BAD_REQUEST",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
