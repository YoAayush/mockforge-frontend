"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { UserContext } from "./userProvider";
import { Project } from "./types";
import axios from "axios";

type ProjectContextType = {
    projectData: Project | null;
};

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({
    projectId,
    children,
}: {
    projectId: string;
    children: ReactNode;
}) => {

    const [project, setProject] = useState<Project | null>(null);

    const { session } = useContext(UserContext);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!session?.access_token || !projectId) return;

                const res = await axios.get(
                    `http://localhost:3000/api/v1/projects/${projectId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );
                console.log(res.data.project);
                setProject(res.data.project);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        fetchProject();
    }, [session, projectId]);

    return (
        <ProjectContext.Provider value={{ projectData: project }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error("useProject must be used within ProjectProvider");
    }

    return context; // { projectData }
};