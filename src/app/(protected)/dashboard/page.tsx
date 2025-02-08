'use client';
import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useProject } from '@/hooks/use-project';
import CommitLog from '@/app/_components/CommitLog';
import AskQuestion from '@/app/_components/AskQuestion';

const Dashboard = () => {
    const { project, projects } = useProject();

    return (
        <div className='w-full'>
            <div>
                <div className="flex items-center justify-center flex-wrap gap-y-4">
                    {/* GitHub Info */}
                    <div className="w-full rounded-md bg-slate-900 px-4 py-3">
                        <div className="w-full">
                            <Github className="size-5 text-white" />
                            <div className="ml-2">
                                <p className="text-sm font-medium text-white">
                                    This project is linked to{' '}
                                    {project?.githubUrl ? (
                                        <Link
                                            href={project.githubUrl}
                                            className="inline-flex items-center text-white/80 hover:underline"
                                        >
                                            {project.githubUrl}
                                            <ExternalLink className="ml-1 size-4" />
                                        </Link>
                                    ) : (
                                        'a GitHub repository.'
                                    )}
                                </p>
                                {/* Ask Question Component */}
                                <div className="mt-2 w-full flex justify-center items-center">
                                    <AskQuestion />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Commit Log */}
                <CommitLog />
            </div>
        </div>
    );
};

export default Dashboard;
