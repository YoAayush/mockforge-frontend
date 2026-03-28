"use client";

import { Sidebar } from "@/components/Sidebar";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ProjectProvider } from "@/lib/projectProvider";

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const { userId, projectId } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (!userId || !projectId) {
            router.replace("/login");
        }
    }, [userId, projectId, router]);

    if (!userId || !projectId) return null;

    return <>
        <div className="flex">
            <ProjectProvider projectId={projectId as string}>
                <Sidebar />
                <main className="flex-1 ml-56">
                    {children}
                </main>
            </ProjectProvider>
        </div>
    </>
};