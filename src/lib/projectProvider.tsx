"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { UserContext } from "./userProvider";
import { Project, Schema } from "./types";
import axios from "axios";

type ProjectContextType = {
  projectData: Project | null;
  notFound?: boolean;
  projectSchemas?: Schema[] | null;
  setProjectSchemas?: React.Dispatch<React.SetStateAction<Schema[] | null>>;
  refetchProject: () => Promise<void>;
  refetchSchemas: () => Promise<void>;
};

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined,
);

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

  const fetchProject = async () => {
    try {
      if (!session?.access_token || !projectId) return;

      const res1 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      setProject(res1.data.project);
      await fetchSchemas(); // Fetch schemas after setting the project data
    } catch (error) {
      console.error("Error fetching project:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404)
        setNotFound(true);
    }
  };

  const fetchSchemas = async () => {
    if (!session?.access_token || !projectId) return;

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/schemas/all/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    setProjectSchemas(res.data.schemas);
  };

  useEffect(() => {
    fetchProject();
  }, [session, projectId]);

  return (
    <ProjectContext.Provider
      value={{
        projectData: project,
        notFound,
        projectSchemas: ProjectSchemas,
        setProjectSchemas,
        refetchSchemas: fetchSchemas,
        refetchProject: fetchProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }

  return context; // { projectData, notFound, projectSchemas, setProjectSchemas, refetchSchemas, refetchProject }
};
