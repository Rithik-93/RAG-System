'use client'
import React from 'react'
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '@/lib/firebase'
import { Card } from '@/components/ui/card';
import { Presentation, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CircularProgressbar } from 'react-circular-progressbar'
import { api } from '@/trpc/react';
import { useProject } from '@/hooks/use-project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const Meeting = () => {
    const [progress, setProgress] = React.useState(0)
    const [isUploading, setIsUploading] = React.useState(false)
    const { project } = useProject()

    const processMeeting = useMutation({
        mutationFn: async (data: { meetingUrl: string, meetingId: string, projectId: string }) => {
            const { meetingUrl, meetingId, projectId } = data; 
            const response = await axios.post('/api/meeting', { meetingUrl, meetingId, projectId });
            return response.data;
        }
    });

    const uploadMeeting = api.project.uploadMeeting.useMutation()
    const router = useRouter()
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', ' .m4a']
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async acceptedFiles => {
            if (!project) return
            
            setIsUploading(true)
            setProgress(0)  // Reset progress at start of upload

            const file = acceptedFiles[0]
            if (!file) {
                setIsUploading(false)
                return
            }

            try {
                const downloadURL = await uploadFile(file as File, setProgress) as string
                uploadMeeting.mutate({
                    meetingUrl: downloadURL,
                    name: file!.name,
                    projectId: project.id,
                },
                {
                    onSuccess: async (meeting) => {
                        toast.success("Meeting uploaded successfully");
                        
                        // Process meeting after successful upload
                        await processMeeting.mutateAsync({ 
                            meetingUrl: downloadURL, 
                            meetingId: meeting.id, 
                            projectId: project.id 
                        });
                        
                        router.push('/meetings');
                    },
                    onError: () => {
                        toast.error("Unable to upload meeting");
                        setIsUploading(false)
                    },
                })
            } catch (error) {
                toast.error("Upload failed");
                setIsUploading(false)
            }
        }
    })

    return (
        <Card className="col-span-2 flex flex-col items-center justify-center p-10" {...getRootProps()}>
            <input {...getInputProps()} />
            {!isUploading ? (
                <div>
                    <Presentation className="h-10 w-10 animate-bounce" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        Create a new meeting
                    </h3>
                    <p className="mt-1 text-center text-sm text-gray-500">
                        Analyse your meeting
                    </p>
                    <div className="mt-6">
                        <Button disabled={isUploading}>
                            <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Upload Meeting
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center flex-col">
                    <CircularProgressbar
                        value={progress}
                        text={`${progress}%`}
                        className="size-20"
                    />
                    <p className="text-sm text-gray-500 text-center">
                        Uploading your meeting...
                    </p>
                </div>
            )}
        </Card>
    );
}

export default Meeting