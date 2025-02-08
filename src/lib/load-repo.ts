import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbedding, summariseCode } from './AI';
import prisma from 'prisma/src';

const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
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
    await Promise.allSettled(allEmbeddings.map(async (x) => {
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateEmbeddings = async (docs: Document[]) => {
    const results = [];
    for (const x of docs) {
        const summary = await summariseCode(x);
        await delay(50);
        const embedding = await generateEmbedding(summary);
        results.push({
            summary,
            embedding,
            sourceCode: JSON.stringify(x.pageContent),
            fileName: x.metadata.source
        });
    }
    return results;
};

// import { Kafka } from 'kafkajs'

// const kafka = new Kafka({
//     clientId: 'my-app',
//     brokers: ['localhost:9092']
// })
// const producer = kafka.producer()

// export async function indexGithubRepo({projectId, githubUrl, githubToken}: { projectId: string, githubUrl: string, githubToken?: string }) {
//     await producer.connect()
//     const payload = JSON.stringify({ projectId, githubUrl, githubToken });
//     await producer.send({
//         topic: 'test-topic',
//         messages: [
//             { value: payload},
//         ],
//     })
// }
// const projectId = "123";
// const githubUrl = "github.com/owner/repo";
// const githubToken = "token";
// indexGithubRepo({projectId, githubUrl, githubToken});