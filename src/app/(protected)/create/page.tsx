"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import React from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';


type FormInput = {
    repoUrl: string
    projectName: string
    githubToken: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation();

    function onSubmit(data: FormInput) {
        // console.log(data)
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success("project creation success")
                reset()
            },
            onError: () => {
                toast.error("Failed to create project")
            }
        })
        return true
    }

    return (
        <div>
            //img tag undraw_github
            <div>
                <div>
                    <h1>
                        Link your Github Repository
                    </h1>
                    <p>
                        Enter the URL of you repository to link
                    </p>
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register('projectName', { required: true })}
                            placeholder="Project Name"
                            required
                        />
                        <div className='h-2'></div>
                        <Input
                            {...register('repoUrl', { required: true })}
                            placeholder="Github URL"
                            type='url'
                            required
                        />
                        <div className='h-2'></div>
                        <Input
                            {...register('githubToken', { required: true })}
                            placeholder="Github Token (Optional)"
                            required
                        />
                        <div className='h-2'></div>
                        <Button type='submit' disabled={createProject.isPending}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePage;