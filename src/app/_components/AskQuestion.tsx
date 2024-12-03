'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MDEditor from '@uiw/react-md-editor';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/hooks/use-project';
import { askQuestion } from '../actions/action';
import { readStreamableValue } from 'ai/rsc';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';
import { Loader2, Send, Save, X } from 'lucide-react';

const AskQuestion = () => {
    const { project } = useProject();
    const [question, setQuestion] = useState('');
    const [fileReferences, setFileReferences] = useState<
        { fileName: string; sourceCode: string; summary: string }[]
    >([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const saveAnswer = api.project.saveAnswer.useMutation();
    const refetch = useRefetch();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAnswer('');
        setFileReferences([]);
        if (!project?.id) return;
        setLoading(true);
        setOpen(true);

        try {
            const { output, fileReferences } = await askQuestion(question, project.id);
            setFileReferences(fileReferences);

            for await (const delta of readStreamableValue(output)) {
                if (delta) {
                    setAnswer((ans) => ans + delta);
                }
            }
        } catch (error) {
            toast.error('Failed to get an answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAnswer = () => {
        saveAnswer.mutate(
            {
                answer,
                question,
                projectId: project!.id,
                filesReferences: fileReferences
            },
            {
                onSuccess: () => {
                    toast.success('Answer saved');
                    refetch();
                },
                onError: () => {
                    toast.error('Failed to save the answer');
                }
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Textarea
                            placeholder="Which file should I edit to change the home page?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="min-h-[100px] text-lg"
                        />
                        <Button type="submit" disabled={loading || !question.trim()} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Ask
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">Answer</DialogTitle>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={handleSaveAnswer}
                                disabled={saveAnswer.isPending || loading || !answer}
                            >
                                {saveAnswer.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Answer
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="mt-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <MDEditor.Markdown
                                source={answer || 'No answer yet.'}
                                className="max-w-[70vw] !h-full max-h-[40vh] overflow-scroll"
                            />
                        )}
                    </div>
                    <CodeReferences fileReferences={fileReferences} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AskQuestion;

