"use client";

import { BarChart3, Code, Zap, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { useParams } from 'next/navigation';
// import axios from 'axios';
import { useEffect, useState } from 'react';
// import { UserContext } from '@/lib/userProvider';
// import { Project } from '@/lib/types';
// import { useParams } from 'next/navigation';
import { useProject } from '@/lib/projectProvider';
import { useUser } from '@/lib/userProvider';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useUser();
    const { projectData, projectSchemas } = useProject();
    const [showProject, setShowProject] = useState(false);
    const [recordsCount, setrecordsCount] = useState<number>(0);

    // console.log(projectData, projectSchemas);

    useEffect(() => {
        const RecordsCount: number = projectSchemas?.reduce((total, schema) => total + (schema?._count.records || 0), 0) || 0;
        // console.log("Total Records:", RecordsCount);
        setrecordsCount(RecordsCount);
        // projectSchemas?.forEach((schema) => {
        //     console.log(schema._count.records);
        // });
    }, [projectData, projectSchemas]);

    // const [project, setProject] = useState<Project>();

    // const { session } = useContext(UserContext);
    // const { projectId } = useParams();
    // console.log(user);

    // useEffect(() => {
    //     const fetchProject = async () => {
    //         try {
    //             if (!session?.access_token) return;

    //             const res = await axios.get(
    //                 `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId as string}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${session.access_token}`,
    //                     },
    //                 }
    //             );

    //             console.log(res);
    //             setProject(res.data.project);
    //         } catch (error) {
    //             console.error("Error fetching project:", error);
    //         }
    //     };

    //     fetchProject();
    // }, [session]);

    setTimeout(() => {
        setShowProject(true);
    }, 2000);

    if (!showProject) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center px-4">
                <div className="flex flex-col items-center justify-center gap-6 text-center">

                    {/* Spinner */}
                    <div className="relative h-12 w-12 sm:h-14 sm:w-14">

                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[rgb(var(--accent))] border-r-[rgb(var(--accent))]" />

                        {/* Inner subtle circle */}
                        <div className="absolute inset-2 rounded-full bg-secondary" />
                    </div>

                    {/* Text */}
                    <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide text-secondary animate-pulse">
                        Loading your project...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b border-border px-8 py-6">
                <h1 className="text-3xl text-primary font-bold mb-2">Dashboard</h1>
                <p className="text-secondary">Welcome back to MockForge</p>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-secondary border border-border rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-primary text-sm font-medium">Total Schemas</h3>
                            <Database className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold">{projectSchemas?.length}</p>
                        <p className="text-xs text-secondary mt-2">Active data models</p>
                    </div>

                    <div className="bg-secondary border border-border rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-primary text-sm font-medium">API Endpoints</h3>
                            <Zap className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold">{Number(projectSchemas?.length) * 5}</p>
                        <p className="text-xs text-secondary mt-2">Generated endpoints</p>
                    </div>

                    <div className="bg-secondary border border-border rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-primary text-sm font-medium">Mock Data</h3>
                            <Code className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-3xl font-bold">{recordsCount ? recordsCount : 0}</p>
                        <p className="text-xs text-secondary mt-2">Mock records generated</p>
                    </div>

                    {/* <div className="bg-secondary border border-border rounded-lg p-6 hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-primary text-sm font-medium">Requests Today</h3>
                            <BarChart3 className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-3xl font-bold">1.2k</p>
                        <p className="text-xs text-secondary mt-2">API requests made</p>
                    </div> */}
                </div>

                {/* Quick Actions */}
                <div className="bg-secondary border border-border rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4 text-primary">Quick Actions</h2>
                    <div className="flex gap-3 flex-wrap">
                        <Link href={`/${user?.id}/${projectData?.id}/schemas/new`}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Create New Schema
                            </Button>
                        </Link>
                        <Link href={`/${user?.id}/${projectData?.id}/api-endpoints`}>
                            <Button className="bg-green-600 hover:bg-green-700">
                                View API Endpoints
                            </Button>
                        </Link>
                        <Link href={`/${user?.id}/${projectData?.id}/api-playground`}>
                            <Button variant="outline" className="border-slate-600 text-secondary hover:text-[rgb(var(--text-tertiary))] hover:bg-[rgb(var(--bg-tertiary))]">
                                Open API Playground
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-secondary border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-primary">Recent Activity</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-tertiary rounded border border-border/50">
                            <div>
                                <p className="text-sm font-medium text-primary">User Schema Updated</p>
                                <p className="text-xs text-secondary">2 fields modified</p>
                            </div>
                            <p className="text-xs text-tertiary">2 hours ago</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-tertiary rounded border border-border/50">
                            <div>
                                <p className="text-sm font-medium text-primary">New Mock Data Generated</p>
                                <p className="text-xs text-secondary">245 records for User schema</p>
                            </div>
                            <p className="text-xs text-tertiary">5 hours ago</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-tertiary rounded border border-border/50">
                            <div>
                                <p className="text-sm font-medium text-primary">API Endpoints Generated</p>
                                <p className="text-xs text-secondary">12 new endpoints created</p>
                            </div>
                            <p className="text-xs text-tertiary">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
