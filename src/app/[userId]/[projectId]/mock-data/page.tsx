'use client'

import { Download, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MockDataPage() {
    const mockData = [
        { id: 1, email: 'john.doe@example.com', name: 'John Doe' },
        { id: 2, email: 'jane.smith@example.com', name: 'Jane Smith' },
        { id: 3, email: 'robert.johnson@example.com', name: 'Robert Johnson' },
        { id: 4, email: 'emily.brown@example.com', name: 'Emily Brown' },
        { id: 5, email: 'michael.davis@example.com', name: 'Michael Davis' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6">
                <h1 className="text-3xl font-bold mb-2">Mock Data</h1>
                <p className="text-slate-400">Generate and manage mock data for your schemas</p>
            </div>

            {/* Toolbar */}
            <div className="border-b border-slate-800 px-8 py-4 flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Generate New
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-900/50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {mockData.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-200">{row.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-200">{row.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-200">{row.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-slate-400">Showing 5 of 245 records</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            Previous
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
