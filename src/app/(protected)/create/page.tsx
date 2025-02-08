"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useRefetch from '@/hooks/use-refetch';
import { api } from '@/trpc/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Github, Loader2 } from 'lucide-react';

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();

    function onSubmit(data: FormInput) {
        console.log(data);
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success("Project created successfully");
                refetch();
                reset();
            },
            onError: () => {
                toast.error("Failed to create project");
            }
        });
        return true;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <Github className="w-5 h-5" />
                        <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
                    </div>
                    <CardDescription>
                        Link your GitHub repository to create a new project
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Project Name
                            </label>
                            <Input
                                {...register('projectName', { required: true })}
                                placeholder="Enter project name"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Repository URL
                            </label>
                            <Input
                                {...register('repoUrl', { required: true })}
                                placeholder="https://github.com/username/repo"
                                type="url"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                GitHub Token
                            </label>
                            <Input
                                {...register('githubToken')}
                                placeholder="ghp_xxxxxxxxxxxxx"
                                type="password"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500">
                                Optional: Required for private repositories
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={createProject.isPending}
                        >
                            {createProject.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>Create Project</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreatePage;