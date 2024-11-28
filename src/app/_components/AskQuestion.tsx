'use client';
import { Button } from '@/components/ui/button';
import MDEditor from '@uiw/react-md-editor'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/hooks/use-project';
import React from 'react';
import { askQuestion } from '../actions/action';
import { readStreamableValue } from 'ai/rsc';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

const AskQuestion = () => {
    const { project } = useProject();
    const [question, setQuestion] = React.useState('');
    const [fileReferences, setFileReferences] = React.useState<
        { fileName: string; sourceCode: string; summary: string }[]
    >([]);
    const [answer, setAnswer] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const saveAnswer = api.project.saveAnswer.useMutation();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFileReferences([])
        e.preventDefault();
        if (!project?.id) return;
        setLoading(true);
        setOpen(true);

        const { output, fileReferences } = await askQuestion(question, project.id);
        setFileReferences(fileReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer((ans) => ans + delta);
            }
        }

        setLoading(false);
    };

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[80vw]'>
                    <DialogHeader>
                        <DialogTitle>Answer</DialogTitle>
                        <Button variant={'outline'} disabled={saveAnswer.isPending} onClick={() => {
                            saveAnswer.mutate({
                                answer,
                                question,
                                projectId: project!.id,
                                filesReferences: fileReferences
                            }, {
                                onSuccess: () => {
                                    toast.success('Answer saved')
                                },
                                onError: () => {
                                    toast.error("failed to save the answer")
                                }
                            })
                        }}>
                            Save Answer
                        </Button>
                    </DialogHeader>
                    <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll' />
                    <CodeReferences fileReferences={fileReferences} />
                    <Button type='button' onClick={() => { setOpen(false) }}>
                        Close
                    </Button>
                    <div>{answer || 'Loading...'}</div>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            placeholder="Which file should I edit to change the home page?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className="h-4"></div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Thinking...' : 'Ask'}
                        </Button>
                    </form>

                    {answer && (
                        <div className="mt-4">
                            <h2 className="text-lg font-medium">Answer</h2>
                            <p>{answer}</p>
                        </div>
                    )}

                    {fileReferences.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-medium">File References</h2>
                            <ul className="list-disc pl-5">
                                {fileReferences.map((file) => (
                                    <li key={file.fileName}>{file.fileName}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AskQuestion;
