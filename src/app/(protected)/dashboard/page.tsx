'use client'
import { Github, ExternalLink } from 'lucide-react'
import Link from 'next/link';
import { useProject } from '@/hooks/use-project'

const Dashboard = () => {
    const { project } = useProject()
    return (
        <div>
            <div>
                <div className='flex items-center justify-between flex-wrap gap-y-4'>
                    {/* github */}
                    <div className='w-fit rounded-md bg-primary px-4 py-3'>
                        <div className="flex items-center">
                            <Github className='size-5 text-white' />
                            <div className="m1-2">
                                <p className='text-sm font-medium Itext-white'>
                                    This project is linked to {' '}
                                    <Link href={project?.githubUrl ?? ""} className='inline-flex items-center Itext-white/80 hover:underline'>
                                        {project?.githubUrl}
                                        <ExternalLink className='ml-1 size-4' />
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
                        question card
                        meeting card
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;