import { Sidebar } from "@/components/Sidebar";
import React from "react";

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return <>
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-56">
                {children}
            </main>
        </div>
    </>
};