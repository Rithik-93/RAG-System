'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import prettier from "prettier/standalone";
import parserTypescript from "prettier/parser-typescript";


type FileReference = {
  fileName: string;
  sourceCode: string;
  summary: string;
};

type Props = {
  fileReferences?: FileReference[];
};

const CodeReferences: React.FC<Props> = ({ fileReferences = [] }) => {
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (fileReferences && fileReferences.length > 0 && !activeTab) {
      //@ts-ignore
      setActiveTab(fileReferences[0].fileName);
    }
  }, [fileReferences, activeTab]);

  if (fileReferences.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-4 max-w-3xl mx-auto">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              {fileReferences.map((file) => (
                <TabsTrigger
                  key={file.fileName}
                  value={file.fileName}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                  {file.fileName}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          {fileReferences.map((file) => (
            <TabsContent key={file.fileName} value={file.fileName} className="mt-2">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    <SyntaxHighlighter
                      language="typescript"
                      style={oneDark}
                      customStyle={{ margin: 0 }}
                      className="!bg-gray-900"
                    >
                      {file.sourceCode
                        .replace(/^"|"$/g, "") 
                        .replace(/\\"/g, '"')  
                        .trim()}
                    </SyntaxHighlighter>
                  </ScrollArea>
                  {/* <p className="mt-2 text-sm text-muted-foreground">{file.summary}</p> */}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeReferences;

