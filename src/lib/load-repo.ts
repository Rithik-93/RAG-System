import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbedding, summariseCode } from './AI';
import prisma from 'prisma/src';

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN,
        branch: 'master',
        ignoreFiles: ["package-lock.json", 'yarn.lock', 'pnpm-lock.json', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    })

    const docs = await loader.load();
    return docs
}


export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbeddings.map(async (x, index) => {
        // console.log(x,index);
        if (!x) {
            console.log("no embeddings")
            return
        }

        const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
            data: {
                fileName: x.fileName,
                summary: x.summary,
                projectId,
                sourceCode: x.sourceCode
            }
        })

         //GPT code
        await prisma.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${x.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `

    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async x => {
        const summary = await summariseCode(x)
        const embedding = await generateEmbedding(summary);
        return {
            summary,
            embedding,
            sourceCode: JSON.stringify(x.pageContent),
            fileName: x.metadata.source
        }
    }))
} 