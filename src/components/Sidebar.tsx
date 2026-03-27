'use client'

import { ChevronLeft, Database, Zap, Code, Gamepad2, Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from './userProvider'
import axios from 'axios'
import { Project } from '@/lib/types'

export function Sidebar() {
    const pathname = usePathname()
    const { userId, projectId } = useParams();
    const [project, setProject] = useState<Project>();

    const { session } = useContext(UserContext);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!session?.access_token) return;

                const res = await axios.get(
                    `http://localhost:3000/api/v1/projects/${projectId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                        },
                    }
                );

                console.log(res);
                setProject(res.data.project);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        fetchProject();
    }, [session]);

    const navItems = [
        { label: 'Schemas', icon: Database, href: `/${userId}/${projectId}/schemas` },
        { label: 'API Endpoints', icon: Zap, href: `/${userId}/${projectId}/api-endpoints` },
        { label: 'Mock Data', icon: Code, href: `/${userId}/${projectId}/mock-data` },
        { label: 'API Playground', icon: Gamepad2, href: `/${userId}/${projectId}/api-playground` },
        { label: 'Settings', icon: SettingsIcon, href: `/${userId}/${projectId}/settings` },
    ]

    return (
        <div className="w-56 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
                <Link href="/">
                    <div className="flex items-center gap-2 mb-1">
                        <Code className="w-5 h-5 text-blue-400" />
                        <h1 className="text-xl font-bold text-white">MockForge</h1>
                    </div>
                </Link>
                <p className="text-sm text-slate-400">{project?.name}</p>
                <p className="text-xs text-slate-500">{project?.description}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                                : 'text-slate-300 hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <Link
                    href={`/${userId}/${projectId}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
        </div>
    )
}
