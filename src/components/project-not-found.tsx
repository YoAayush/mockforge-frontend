'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectNotFoundProps {
    projectId?: string
    message?: string
}

export function ProjectNotFound({ projectId, message }: ProjectNotFoundProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
            <div className="flex flex-col items-center justify-center text-center max-w-md">
                {/* Icon */}
                <div className="mb-6 p-4 bg-red-500/10 rounded-full">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-white mb-2">Project Not Found</h1>

                {/* Description */}
                <p className="text-slate-400 text-base mb-6">
                    {message || 'The project you &apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.'}
                </p>

                {/* Project ID if provided */}
                {projectId && (
                    <div className="mb-6 p-3 bg-slate-800/50 border border-slate-700 rounded-lg w-full">
                        <p className="text-xs text-slate-500 mb-1">Project ID</p>
                        <p className="text-sm font-mono text-slate-300 break-all">{projectId}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                    <Link href="/" className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <Link href="/(admin)/schemas" className="flex-1">
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                            Browse Projects
                        </Button>
                    </Link>
                </div>

                {/* Additional Info */}
                <p className="text-xs text-slate-500 mt-8">
                    If you think this is a mistake, please contact support or try creating a new project.
                </p>
            </div>
        </div>
    )
}
