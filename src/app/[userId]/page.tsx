"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@/lib/userProvider";
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

    const { user, session } = useUser(); // userContext
    // console.log(user);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!session?.access_token) return;

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/projects/`,
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
    }, 1000);

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
        <main className="min-h-screen bg-background">
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

                            {/* Spinner */}
                            <div className="relative h-12 w-12 sm:h-14 sm:w-14">

                                {/* Outer rotating ring */}
                                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[rgb(var(--accent))] border-r-[rgb(var(--accent))]" />

                                {/* Inner subtle circle */}
                                <div className="absolute inset-2 rounded-full bg-secondary" />
                            </div>
                        </div>
                    ) : projects?.length === 0 ? (
                        <div className="max-w-md text-primary">

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