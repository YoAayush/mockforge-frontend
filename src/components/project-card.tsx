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
            <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer p-6">
                <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{project.description || "No description"}</p>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                    {/* <span>{project.schemas.length} schema{project.schemas.length !== 1 ? 's' : ''}</span> */}
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
            </Card>
        </Link>
    );
}
