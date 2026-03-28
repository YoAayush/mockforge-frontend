"use client";

import { BarChart3, Code, Zap, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { useParams } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
// import { UserContext } from '@/lib/userProvider';
// import { Project } from '@/lib/types';
// import { useParams } from 'next/navigation';
import { useProject } from '@/lib/projectProvider';

export default function DashboardPage() {

    const { projectData } = useProject();
    // const [project, setProject] = useState<Project>();
    const [showProject, setShowProject] = useState(false);

    // const { session } = useContext(UserContext);
    // const { projectId } = useParams();
    // console.log(user);

    // useEffect(() => {
    //     const fetchProject = async () => {
    //         try {
    //             if (!session?.access_token) return;

    //             const res = await axios.get(
    //                 `http://localhost:3000/api/v1/projects/${projectId as string}`,
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
            <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000] text-blue-100 px-4">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    {/* Spinner */}
                    <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                        <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"></div>
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000]"></div>
                    </div>

                    {/* Text */}
                    <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide animate-pulse">
                        Loading Your Project ...
                    </p>
                </div>
            </div>
        );
    }

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
