import { api } from '@/trpc/react';
import { useLocalStorage } from 'usehooks-ts'

export const useProject = () => {
    const { data: projects } = api.project.getProject.useQuery()
    const [projectId, setProjectId] = useLocalStorage("ProjectId","")
    const project = projects?.find(x => x.id === projectId)
    return {
        projects,
        project,
        projectId,
        setProjectId
    }
}