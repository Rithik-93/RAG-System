'use client'

import AskQuestion from '@/app/_components/AskQuestion';
import CodeReferences from '@/app/_components/code-references';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProject } from '@/hooks/use-project'
import { api } from '@/trpc/react';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import React from 'react'

// Explicitly define a simple type
type Question = {
    id: string;
    user: {
        imageUrl: string | null;
    };
    question: string;
    createdAt: Date | string;
    answer: string;
    fileReferences: any[];
};

const Qna = () => {
    const { projectId } = useProject();
    
    const { data: questions } = api.project.getQuestions.useQuery({ projectId }) as { 
        data?: Question[] 
    };

    const [questionIndex, setQuestionIndex] = React.useState(0);
    const question = questions && questions.length > 0 ? questions[questionIndex] : null;

    return (
        <Sheet>
            <AskQuestion />
            <div className='h-4'>
                <div className='text-xl font-semibold'>
                    Saved Questions
                </div>
                <div className='flex flex-col gap-2'>
                    {questions && questions.map((q, index) => (
                        <React.Fragment key={q.id || index}>
                            <SheetTrigger onClick={() => setQuestionIndex(index)}>
                                <div className='flex items-center gap-4 bg-white rounded-lg p-4 shadow border'>
                                    <Image
                                        className='rounded-full'
                                        height={30}
                                        width={30}
                                        src={q.user.imageUrl || "/default-profile-pic.png"}
                                        alt='user profile pic'
                                    />
                                    <div className='text-left flex flex-col'>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-gray-700 line-clamp-1 text-lg font-medium'>
                                                {q.question}
                                            </p>
                                            <span className='text-xs text-gray-400 whitespace-nowrap'>
                                                {new Date(q.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className='text-gray-500 line-clamp-1 text-sm'>
                                            {q.answer}
                                        </p>
                                    </div>
                                </div>
                            </SheetTrigger>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {question && (
                <SheetContent className='sm: max-w-[80vw]'>
                    <SheetHeader>
                        <SheetTitle>{question.question}</SheetTitle>
                        <MDEditor.Markdown source={question.answer} />
                        <CodeReferences fileReferences={question.fileReferences || []} />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    );
}

export default Qna;