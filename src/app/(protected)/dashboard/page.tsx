'use client';
import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useProject } from '@/hooks/use-project';
import CommitLog from '@/app/_components/CommitLog';
import AskQuestion from '@/app/_components/AskQuestion';
import Meeting from '@/app/_components/Meeting';

const Dashboard = () => {
    const { project } = useProject();
    console.log(project, "project");

    return (
        <div>
            <div>
                <div className="flex items-center justify-between flex-wrap gap-y-4">
                    {/* GitHub Info */}
                    <div className="w-fit rounded-md bg-primary px-4 py-3">
                        <div className="flex items-center">
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
                                <div className="mt-2">
                                    <AskQuestion />
                                    <Meeting/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Content */}
                <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                        {/* Placeholder cards */}
                        <div>Question card</div>
                        <div>Meeting card</div>
                    </div>
                </div>

                {/* Commit Log */}
                <CommitLog />
            </div>
        </div>
    );
};

export default Dashboard;
