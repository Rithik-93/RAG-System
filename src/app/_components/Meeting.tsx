import React from 'react'
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '@/lib/firebase'
import { Card } from '@/components/ui/card';
import { Presentation, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CircularProgressbar } from 'react-circular-progressbar'

const Meeting = () => {
    const [progress, setProgress] = React.useState(0)
    const [isUploading, setIsuploading] = React.useState(false)
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', ' .m4a']
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async acceptedFiles => {
            setIsuploading(true)
            console.log(acceptedFiles)
            const file = acceptedFiles[0]
            const downloadURL = await uploadFile(file as File, setProgress)
            setIsuploading(false)
        }
    })
    return (
        <Card className="col-span-2 flex flex-col items-center justify-center p-10">
            {isUploading && (
                <>
                    <Presentation className="h-10 w-10 animate-bounce" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        Create a new meeting
                    </h3>
                    <p className="mt-1 text-center text-sm text-gray-500">
                        Analyse your meeting with Dionysus.
                        <br />
                        Powered by AI.
                    </p>
                    <div className="mt-6">
                        <Button disabled={isUploading}>
                            <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Upload Meeting
                            <input className="hidden" {...getInputProps()} />
                        </Button>
                    </div>
                </>
            )}
            {isUploading && (
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
