'use server'
import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateEmbedding } from '@/lib/AI';
import prisma from 'prisma/src';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function askQuestion(question: string, projectId: string) {
    const stream = createStreamableValue()

    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await prisma.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    ` as { fileName: string; sourceCode: string; summary: string; }[]

    let context = ''

    for (const doc of result) {
        context += `source ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
    }

    (async () => {
        const { textStream } = await streamText({
            model: google('gemini-1.5-flash'),
            prompt: `
            
You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern.  
AI assistant is a brand new, powerful, human-like artificial intelligence.  
The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.  
AI is a well-behaved and well-mannered individual.  
AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.  
AI has the sum of all knowledge in their brain and is able to accurately answer nearly any question about any topic in programming, algorithms, tools, and code-related issues.  
If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions when necessary.  

START CONTEXT BLOCK  
${context}  
END OF CONTEXT BLOCK  

START QUESTION  
${question}  
END OF QUESTION  

AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.  
If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to this based on the given context."  
AI assistant will not apologize for previous responses, but instead will indicate new information was gained if asked about the same topic again.  
AI assistant will not invent anything that is not drawn directly from the context.  
Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, ensuring clarity and accuracy in the response.  
`
        })

        for await (const delta of textStream) {
            stream.update(delta)
        }

        stream.done()
    })()

    return {
        output: stream.value,
        fileReferences: result
    }
}