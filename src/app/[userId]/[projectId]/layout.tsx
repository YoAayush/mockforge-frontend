"use client";

import { Sidebar } from "@/components/Sidebar";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ProjectProvider, useProject } from "@/lib/projectProvider";
import { ProjectNotFound } from "@/components/project-not-found";
import Loader from "@/components/Loader";

function LayoutInner({ children }: { children: React.ReactNode }) {
    const { notFound, projectData } = useProject();
    const { projectId }: { projectId: string } = useParams();

    if (notFound) {
        return <ProjectNotFound projectId={projectId} />;
    }

    if (!projectData) {
        return <Loader />;
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-56">{children}</main>
        </div>
    );
}

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const { userId, projectId }: { userId: string; projectId: string } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (!userId || !projectId) {
            router.replace("/auth/login");
        }
    }, [userId, projectId, router]);

    if (!userId || !projectId) return <Loader />;

    return (
        <ProjectProvider projectId={projectId as string}>
            <LayoutInner>{children}</LayoutInner>
        </ProjectProvider>
    );
};