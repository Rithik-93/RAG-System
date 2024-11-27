import { Octokit } from "octokit";
import prisma from "prisma/src";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const githubUrl = 'https://github.com/docker/genai-stack'

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
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