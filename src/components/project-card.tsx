"use client";

import Link from "next/link";
import { Project } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface ProjectCardProps {
    project: Project;
    userId: string;
}

export function ProjectCard({ project, userId }: ProjectCardProps) {

    // if (!userId) return new Error("Project ID is missing !!!");

    return (
        <Link href={`/${userId}/${project.id}`}>
            <Card className="group relative bg-slate-900/50 hover:bg-slate-800/50 border-2 border-slate-800/50 hover:border-slate-700 rounded-xl p-6 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                        {project.name}
                    </h3>

                    <div className="space-y-3 mb-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">API ID</p>
                            <p className="font-mono text-sm text-slate-300 break-all">{project.id}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500">Created {new Date(project.createdAt).getDate()}/{new Date(project.createdAt).getMonth()}/{new Date(project.createdAt).getFullYear()}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
