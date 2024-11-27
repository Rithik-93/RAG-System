import { Octokit } from "octokit";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const githubUrl = 'https://github.com/docker/genai-stack'

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const { data } = await octokit.rest.repos.listCommits({
        owner: 'docker',
        repo: 'genai-stack'
    })
    console.log((data));
}

getCommitHashes(githubUrl);