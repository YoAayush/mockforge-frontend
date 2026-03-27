'use client'

import { Copy, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function APIEndpointsPage() {
    const endpoints = [
        {
            id: 1,
            method: 'GET',
            path: '/api/mock/c5a67c10-6109-464f-9f5e-9d1d782786dc/user',
            description: 'Get all User records',
            color: 'bg-blue-500/20 text-blue-400',
        },
        {
            id: 2,
            method: 'GET',
            path: '/api/mock/c5a67c10-6109-464f-9f5e-9d1d782786dc/user/{id}',
            description: 'Get a single User record by ID',
            color: 'bg-blue-500/20 text-blue-400',
        },
        {
            id: 3,
            method: 'POST',
            path: '/api/mock/c5a67c10-6109-464f-9f5e-9d1d782786dc/user',
            description: 'Create a new User record',
            color: 'bg-green-500/20 text-green-400',
        },
        {
            id: 4,
            method: 'PUT',
            path: '/api/mock/c5a67c10-6109-464f-9f5e-9d1d782786dc/user/{id}',
            description: 'Update an existing User record',
            color: 'bg-yellow-500/20 text-yellow-400',
        },
        {
            id: 5,
            method: 'DELETE',
            path: '/api/mock/c5a67c10-6109-464f-9f5e-9d1d782786dc/user/{id}',
            description: 'Delete a User record',
            color: 'bg-red-500/20 text-red-400',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6">
                <h1 className="text-3xl font-bold mb-2">API Endpoints</h1>
                <p className="text-slate-400">Auto-generated REST endpoints for your schemas</p>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                        <div
                            key={endpoint.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <span className={`px-3 py-1 rounded font-mono text-xs font-semibold ${endpoint.color}`}>
                                        {endpoint.method}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm text-slate-200 break-all">{endpoint.path}</p>
                                        <p className="text-sm text-slate-400 mt-1">{endpoint.description}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 flex gap-2 shrink-0"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy URL
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
