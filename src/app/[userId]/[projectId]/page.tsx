"use client";

import { BarChart3, Code, Zap, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { useParams } from 'next/navigation';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back to MockForge</p>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-300 text-sm font-medium">Total Schemas</h3>
                            <Database className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold">5</p>
                        <p className="text-xs text-slate-500 mt-2">Active data models</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-300 text-sm font-medium">API Endpoints</h3>
                            <Zap className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-xs text-slate-500 mt-2">Generated endpoints</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-300 text-sm font-medium">Mock Data</h3>
                            <Code className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-3xl font-bold">245</p>
                        <p className="text-xs text-slate-500 mt-2">Mock records generated</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-300 text-sm font-medium">Requests Today</h3>
                            <BarChart3 className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-3xl font-bold">1.2k</p>
                        <p className="text-xs text-slate-500 mt-2">API requests made</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="flex gap-3 flex-wrap">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Create New Schema
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            View API Endpoints
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            Open API Playground
                        </Button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <div>
                                <p className="text-sm font-medium">User Schema Updated</p>
                                <p className="text-xs text-slate-500">2 fields modified</p>
                            </div>
                            <p className="text-xs text-slate-400">2 hours ago</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <div>
                                <p className="text-sm font-medium">New Mock Data Generated</p>
                                <p className="text-xs text-slate-500">245 records for User schema</p>
                            </div>
                            <p className="text-xs text-slate-400">5 hours ago</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
                            <div>
                                <p className="text-sm font-medium">API Endpoints Generated</p>
                                <p className="text-xs text-slate-500">12 new endpoints created</p>
                            </div>
                            <p className="text-xs text-slate-400">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
