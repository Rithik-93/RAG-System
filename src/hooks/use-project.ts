'use client'
import { api } from '@/trpc/react';
import { useLocalStorage } from 'usehooks-ts'

export const useProject = () => {
    console.log("API project structure:", api.project);

    const { data, isLoading, error } = api.project.getProject.useQuery();
    const projects = data ?? []; 
    const [projectId, setProjectId] = useLocalStorage("ProjectId", "");
    const project = projects.find(x => x.id === projectId);

    return {
        isLoading,
        error,
        projects,
        project,
        projectId,
        setProjectId,
    };
};
