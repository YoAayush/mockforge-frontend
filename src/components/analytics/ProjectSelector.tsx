"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/userProvider";
import axios from "axios";
import type { Project } from "@/lib/types";

export function ProjectSelector() {
  const { userId, projectId } = useParams<{ userId: string; projectId: string }>();
  const router = useRouter();
  const { session } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!session?.access_token) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      .then((res) => setProjects(res.data.projects ?? []))
      .catch(() => setProjects([]));
  }, [session]);

  if (!projects.length) return null;

  return (
    <select
      value={projectId}
      onChange={(e) => router.push(`/${userId}/${e.target.value}/analytics`)}
      className="px-3 py-2 text-sm rounded-lg border border-border bg-secondary text-primary"
      aria-label="Select project"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
