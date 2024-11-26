"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form'


type FormInput = {
    repoUrl: string
    projectName: string
    githubToken: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()

    function onSubmit(data: FormInput) {
        console.log(data)
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
                            required
                        />
                        <div className='h-2'></div>
                        <Input
                            {...register('githubToken', { required: true })}
                            placeholder="Github Token (Optional)"
                            required
                        />
                        <div className='h-2'></div>
                        <Button type='submit'>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePage;