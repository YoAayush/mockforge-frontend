'use client'

import { ChevronLeft, Database, Zap, Code, Gamepad2, Settings as SettingsIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { useContext } from 'react'
// import { UserContext } from '../lib/userProvider'
// import axios from 'axios'
// import { Project } from '@/lib/types'
import { useProject } from '@/lib/projectProvider'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function Sidebar() {
    const pathname = usePathname()
    const { userId, projectId } = useParams();
    const { projectData } = useProject();
    const router = useRouter();
    // const [project, setProject] = useState<Project>();

    // const { session } = useContext(UserContext);

    // useEffect(() => {
    //     const fetchProject = async () => {
    //         try {
    //             if (!session?.access_token) return;

    //             const res = await axios.get(
    //                 `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${session?.access_token}`,
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

    const navItems = [
        { label: 'Dashboard', icon: Database, href: `/${userId}/${projectId}/dashboard` },
        { label: 'Schemas', icon: Database, href: `/${userId}/${projectId}/schemas` },
        { label: 'API Endpoints', icon: Zap, href: `/${userId}/${projectId}/api-endpoints` },
        // { label: 'Mock Data', icon: Code, href: `/${userId}/${projectId}/mock-data` },
        { label: 'API Playground', icon: Gamepad2, href: `/${userId}/${projectId}/api-playground` },
        { label: 'Settings', icon: SettingsIcon, href: `/${userId}/${projectId}/settings` },
    ]

    const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
            return;
        }

        toast.success("Logged out successfully!");
        // router.push("/auth/callback");
        router.replace("/");
    };

    return (
        <div className="w-56 bg-primary flex flex-col h-screen fixed left-0 top-0 border-r border-border">
            {/* Header */}
            <div className="p-7 border-b border-border">
                <Link href="/">
                    <div className="flex items-center gap-2 mb-1">
                        <Code className="w-5 h-5 text-blue-400" />
                        <h1 className="text-xl font-bold text-primary">MockForge</h1>
                    </div>
                </Link>
                <p className="text-lg text-slate-400">{projectData?.name}</p>
                {/* <p className="text-xs text-slate-500">{projectData?.description}</p> */}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.includes(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-secondary text-blue-400 border border-blue-400/30'
                                : 'text-secondary hover:bg-[rgb(var(--bg-tertiary))]'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border">
                <Link
                    href={`/${userId}`}
                    className="p-4 w-full flex items-center content-center justify-center gap-2 text-secondary hover:text-[rgb(var(--text-tertiary))]  hover:bg-[rgb(var(--bg-tertiary))] transition-colors text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Projects List</span>
                </Link>
            </div>
            <div className="p-4 border-t border-border">
                <button className="w-full text-sm text-center text-[rgb(var(--text-secondary))] hover:text-red-500 transition-colors font-medium cursor-pointer" onClick={logout}>
                    Logout <LogOutIcon className="w-4 h-4 inline-block" />
                </button>
            </div>
        </div>
    )
}
