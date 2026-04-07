"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { UserContext } from "./userProvider";
import { Project, Schema } from "./types";
import axios from "axios";

type ProjectContextType = {
    projectData: Project | null;
    notFound?: boolean;
    projectSchemas?: Schema[] | null;
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
    const [ProjectSchemas, setProjectSchemas] = useState<Schema[] | null>([]);
    const [notFound, setNotFound] = useState(false);
    const { session } = useContext(UserContext);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!session?.access_token || !projectId) return;

                const res1 = await axios.get(
                    `http://localhost:3000/api/v1/projects/${projectId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );
                const res2 = await axios.get(
                    `http://localhost:3000/api/v1/schemas/all/${projectId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );
                // console.log(res1.data.project);
                // console.log(res2.data.schemas);
                setProject(res1.data.project);
                setProjectSchemas(res2.data.schemas);
            } catch (error) {
                console.error("Error fetching project:", error);
                if (axios.isAxiosError(error) && error.response?.status === 404) setNotFound(true);
            }
        };

        fetchProject();
    }, [session, projectId]);

    return (
        <ProjectContext.Provider value={{ projectData: project, notFound, projectSchemas: ProjectSchemas }}>
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