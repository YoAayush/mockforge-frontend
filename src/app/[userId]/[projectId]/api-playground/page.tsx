'use client'

import { Play, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function APIPlaygroundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6">
                <h1 className="text-3xl font-bold mb-2">API Playground</h1>
                <p className="text-slate-400">Test and debug your API endpoints</p>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                    {/* Request Panel */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Code className="w-5 h-5" />
                            Request
                        </h2>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Method</label>
                                <select className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm">
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PUT</option>
                                    <option>DELETE</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
                                <input
                                    type="text"
                                    placeholder="/api/mock/..."
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm placeholder-slate-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Headers</label>
                                <textarea
                                    placeholder="Content-Type: application/json"
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm placeholder-slate-500 font-mono text-xs"
                                    rows={4}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Body</label>
                                <textarea
                                    placeholder={'{\n  "email": "test@example.com"\n}'}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm placeholder-slate-500 font-mono text-xs flex-1"
                                    rows={6}
                                />
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700 flex gap-2">
                                <Play className="w-4 h-4" />
                                Send Request
                            </Button>
                        </div>
                    </div>

                    {/* Response Panel */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">Response</h2>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex-1">
                            <div className="mb-4 pb-4 border-b border-slate-700">
                                <p className="text-sm text-slate-400">
                                    Status: <span className="text-green-400 font-semibold">200 OK</span>
                                </p>
                                <p className="text-sm text-slate-400">
                                    Time: <span className="text-slate-300">128ms</span>
                                </p>
                            </div>

                            <div className="bg-slate-900/50 rounded p-4 font-mono text-xs text-slate-200 overflow-auto max-h-96">
                                <pre>{`{
  "id": 1,
  "email": "john.doe@example.com",
  "name": "John Doe",
  "createdAt": "2026-02-22T10:30:00Z"
}`}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
