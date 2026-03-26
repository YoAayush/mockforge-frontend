"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/components/userProvider";
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
    console.log(userId);

    const [projects, setProjects] = useState<Project[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    // const { data: {user} } = await supabase.auth.getUser();
    // console.log(user)

    const { user, session } = useContext(UserContext);
    console.log(user);

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
        <main className="min-h-screen bg-slate-900">
            <Header
                title="My Projects"
                subtitle="Create and manage your mock API projects"
                action={{
                    label: "+ New Project",
                    onClick: () => setDialogOpen(true),
                }}
                logout={logout}
            />

            <div className="px-8 py-12">
                {projects.length === 0 ? (
                    <div className="max-w-md">
                        {/* <Empty
                            title="No projects yet"
                            aria-description="Create your first mock API project to get started"
                        /> */}

                        No Projects Available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>

            <CreateProjectDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </main>
    );
}