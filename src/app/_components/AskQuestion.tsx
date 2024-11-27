'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useProject } from '@/hooks/use-project'
import React from 'react'

const AskQuestion = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState("")

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
        </CardContent>
      </Card>
    </div>
  )
}

export default AskQuestion
