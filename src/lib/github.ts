import { Octokit } from "octokit";
import prisma from "prisma/src";
import axios from 'axios';
import { summariseCommitAI } from "./AI";
import dotenv from "dotenv";
dotenv.config();


export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
    console.log({ owner, repo });
    console.log("GITHUB_TOKEN is", process.env.GITHUB_TOKEN ? "present" : "missing");

    if (!owner || !repo) {
        throw new Error("Invalid github url")
    }
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })
    // console.log((data));
    const sortedCommits = data.sort((a, b) =>
        new Date(b.commit.author?.date ?? "").getTime() -
        new Date(a.commit.author?.date ?? "").getTime()
    );

    return sortedCommits.slice(0, 15).map((x) => ({
        commitHash: x.sha,
        commitMessage: x.commit.message ?? "",
        commitAuthorName: x.author?.login ?? "",
        commitAuthorAvatar: x.author?.avatar_url ?? "",
        commitDate: x.commit.author?.date ?? "",
    }));
}

// console.log(await getCommitHashes(githubUrl));
export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(x => {
        return summariseCommit(githubUrl, x.commitHash)
    }))

    const summaries = summaryResponses.map((x) => {
        if (x.status === 'fulfilled') {
            return x.value as string
        }
        return ""
    })

    const commits = await prisma.commit.createMany({
        data:
            summaries.map((summary, index) => {
                return {
                    projectId,
                    commitHash: unprocessedCommits[index]!.commitHash,
                    commitMessage: unprocessedCommits[index]!.commitMessage,
                    commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                    commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                    commitDate: unprocessedCommits[index]!.commitDate,
                    summary
                }
            })
    })
    return commits
}

export async function summariseCommit(githubUrl: string, commitHash: string) {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await summariseCommitAI(data) || ""
}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })

    if (!project?.githubUrl) {
        throw new Error("project has no githubUrl")
    }

    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await prisma.commit.findMany({
        where: {
            projectId
        }
    })

    const processedCommitsHashes = (processedCommits).map((x) => x.commitHash)
    return commitHashes.filter((x) => !processedCommitsHashes.includes(x.commitHash))
}