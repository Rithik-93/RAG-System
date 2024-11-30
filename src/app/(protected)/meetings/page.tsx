'use client'
import Meeting from '@/app/_components/Meeting'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/use-project';
import { api } from '@/trpc/react';
import Link from 'next/link';
import React from 'react'

const Meetings = () => {
    const { projectId } = useProject();
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({projectId})
  return (
    <>
    <Meeting/>
    {/* <div></div> */}
    <h1 className='text-xl font-semibold'>
        Meetings
    </h1>
    {meetings && meetings?.map(m => (
        <li key={m.id} className='flex items-center justify-between py-5 gap-x-6'>
            <div>
                <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                        <Link href={`/meetings/${m.id}`} className='text-sm font-semibold'>
                        {m.name}
                        </Link>
                        {m.status === 'PROCESSING' && (
                            <Badge className='bg-yellow-500 text-white'>
                                Processing..
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            <div className='flex items-center flex-none gap-x-4'>
                <Link href={`/meetings/${m.id}`}>
                <Button variant='outline'>
                    View meeting
                </Button>
                </Link>
            </div>
        </li>
    ))}
    </>
  )
}

export default Meetings
