"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/userProvider";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { Header } from "@/components/user-header";
import { ProjectCard } from "@/components/project-card";
import { Project } from "@/lib/types";
import axios from "axios";
// import { Empty } from "@/components/ui/empty";

export default function Dashboard() {
    const router = useRouter();
    const { userId } = useParams();
    // console.log(userId);

    const [projects, setProjects] = useState<Project[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [projectsList, setprojectsList] = useState(false);

    // const { data: {user} } = await supabase.auth.getUser();
    // console.log(user)

    const { user, session } = useContext(UserContext); // userContext
    // console.log(user);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!session?.access_token) return;

                const res = await axios.get(
                    "http://localhost:3000/api/v1/projects/",
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );

                console.log(res);
                setProjects(res.data.projects);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        fetchProject();
    }, [session]);

    setTimeout(() => {
        setprojectsList(true);
    }, 2000);

    const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
            return;
        }

        // router.push("/auth/callback");
        router.replace("/");
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            <Header
                title="My Projects"
                subtitle="Create and manage your mock API projects"
                action={{
                    label: "+ New Project",
                    onClick: () => setDialogOpen(true),
                }}
                userName={`${user?.user_metadata?.full_name}`}
                logout={logout}
            />

            <div className="px-12 py-4">
                {
                    !projectsList ? (
                        <div className="flex flex-col items-center justify-center gap-6 text-center">
                            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                                <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"></div>
                                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#0a192f] via-[#020617] to-[#000]"></div>
                            </div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="max-w-md text-white">

                            No Projects Available
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} userId={userId as string} />
                            ))}
                        </div>
                    )
                }
            </div>

            <CreateProjectDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </main>
    );
}