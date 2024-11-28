'use client'
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import React from 'react';

type Props = {
    fileReferences: { fileName: string; sourceCode: string; summary: string }[]
}

const CodeReferences = ({ fileReferences }: Props) => {
    const [tab, setTab] = React.useState(fileReferences[0]?.fileName);
    return (
        <div className="max-w-[70vw]">
            <Tabs value={tab} onValueChange={setTab}>
                <div className="overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md">
                    {fileReferences.map((file) => (
                        <button
                            key={file.fileName}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespaces-nowrap text-muted-foreground hover:bg-muted",
                                {
                                    "bg-primary text-primary-foreground": tab === file.fileName,
                                }
                            )}
                            onClick={() => setTab(file.fileName)}
                        >
                            {file.fileName}
                        </button>
                    ))}
                </div>
                {fileReferences.map((file) => (
                    <TabsContent
                        key={file.fileName}
                        value={file.fileName}
                        className="max-h-[40vh] overflow-scroll max-w-7xl rounded-md"
                    >
                        <SyntaxHighlighter language="typescript" style={dracula}>
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default CodeReferences
