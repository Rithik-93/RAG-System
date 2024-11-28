'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useProject } from '@/hooks/use-project'
import React from 'react'
import { askQuestion } from '../actions/action'
import { readStreamableValue } from 'ai/rsc'

const AskQuestion = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState("")
    const [fileReferences, setFileReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])
    const [ answer, setAnswer ] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!project?.id) return
        setLoading(true)

        const { output, fileReferences } = await askQuestion(question, project.id)
        setFileReferences(fileReferences)

        for await (const delta of readStreamableValue(output)) {
            if(delta) {
                setAnswer(ans => ans + delta)
            }
        }

        setLoading(false);
        window.alert(question)
    }

  return (
    <div>
      <Card>
        <CardHeader>
            <CardTitle>
                Ask a question
            </CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSubmit}>
                <Textarea 
                placeholder='which file should I edit to change the home page'
                onChange={((e) => setQuestion(e.target.value))}/>
                <div className='h-4'></div>
                <Button type='submit'>
                    Ask
                </Button>
            </form>
            {answer}
            <h1>Files References</h1>
            {fileReferences.map(file => {
                return <span>{file.fileName}</span>
            })}
        </CardContent>
      </Card>
    </div>
  )
}

export default AskQuestion
