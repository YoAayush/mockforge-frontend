'use client'

import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SchemasPage() {
    const schemas = [
        {
            id: 1,
            name: 'User',
            fields: 2,
            created: '2/2/2026',
        },
        {
            id: 2,
            name: 'Product',
            fields: 5,
            created: '2/1/2026',
        },
        {
            id: 3,
            name: 'Order',
            fields: 4,
            created: '1/28/2026',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Schemas</h1>
                    <p className="text-slate-400">Define data models for your mock APIs</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
                    <Plus className="w-4 h-4" />
                    New Schema
                </Button>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-900/50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Model Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fields</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Created</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {schemas.map((schema) => (
                                <tr key={schema.id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-200">{schema.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{schema.fields} fields</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{schema.created}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-slate-700 rounded text-blue-400 hover:text-blue-300 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-700 rounded text-red-400 hover:text-red-300 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
