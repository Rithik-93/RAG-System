import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document } from '@langchain/core/documents'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const summariseCommitAI = async (diff: string) => {

    const response = await model.generateContent([
        `
        You are an expert programmer, and you are trying to summarize a git diff.
        Reminders about the git diff format:
        For every file, there are a few metadata lines, like (for example):
        \`\`\`
        diff --git a/lib/index.js b/lib/index.js
        index aadf691..bfef603 100644
        --- a/lib/index.js
        +++ b/lib/index.js
        \`\`\`
        This means that 'lib/index.js' was modified in this commit. Note that this is only an example.
        Then there is a specifier of the lines that were modified.
        A line starting with '+' means it was added.
        A line starting with '-' means that line was deleted.
        A line that starts with neither '+' nor '-' is code given for context and better understanding.
        It is not part of the diff.

        Example summary comments:
        \`\`\`
        * Raised the amount of returned recordings from 10 to 100 [packages/server/recordings_api.ts], [packages/server/constants.ts]
        * Fixed a typo in the GitHub action name (.github/workflows/gpt-commit-summarizer.yml)
        * Moved the 'octokit' initialization to a separate file [src/octokit.ts], [src/index.ts]
        * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
        * Lowered numeric tolerance for test files
        \`\`\`

        Most commits will have fewer comments than this example list.
        The last comment does not include the file names because there were more than two relevant files in the hypothetical commit.
        Do not include parts of the example of appropriate comments`,

        `Please summarise the following diff file: \n\n${diff}`
    ]);

    return response.response.text()
}

export async function summariseCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    try{
        const code = doc.pageContent.slice(0, 1000);
    const response = await model.generateContent([
              `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
              `You are onboarding a junior software engineer and explaining to them the purpose of the $(doc.metadata.source] file
Here is the code:
---
${code}
---
                 Give a summary no more than 100 words of the code above
    `]);

    return response.response.text()
    
    } catch(e) {
        console.error(e, "error while sumarising code")
        return ""
    }
    

}

export async function generateEmbedding(summary: string) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })
    const res = await model.embedContent(summary)
    const embedding = res.embedding;
    return embedding.values
}

// const dif = `
// diff --git a/bun.lockb b/bun.lockb
// index f200d75..e8e029f 100644
// Binary files a/bun.lockb and b/bun.lockb differ
// diff --git a/package.json b/package.json
// index 299b25e..8cb629e 100644
// --- a/package.json
// +++ b/package.json
// @@ -77,6 +77,7 @@
//      "superjson": "^2.2.1",
//      "tailwind-merge": "^2.5.5",
//      "tailwindcss-animate": "^1.0.7",
// +    "usehooks-ts": "^3.1.0",
//      "vaul": "^1.1.1",
//      "zod": "^3.23.8"
//    },
// diff --git a/src/app/(protected)/app-sidebar.tsx b/src/app/(protected)/app-sidebar.tsx
// index bf40cc4..55f2523 100644
// --- a/src/app/(protected)/app-sidebar.tsx
// +++ b/src/app/(protected)/app-sidebar.tsx
// @@ -1,6 +1,7 @@
//  import { Sidebar, SidebarHeader } from "@/components/ui/sidebar"
//  import { LayoutDashboard, Bot, Presentation, CreditCard } from "lucide-react";
//  import { usePathname } from "next/navigation"
// +import { useProject } from "@/hooks/use-project"
 
//  const items = [
//      {
// @@ -23,6 +24,7 @@ const items = [
//  ]
 
//  const AppSidebar = () => {
// +    const {projectId, projects } = useProject();
//      return (
//          <Sidebar collapsible="icon" variant="floating">
//              <SidebarHeader>
// diff --git a/src/app/(protected)/create/page.tsx b/src/app/(protected)/create/page.tsx
// index 46de654..38351c8 100644
// --- a/src/app/(protected)/create/page.tsx
// +++ b/src/app/(protected)/create/page.tsx
// @@ -1,6 +1,7 @@
//  "use client";
//  import { Button } from '@/components/ui/button';
//  import { Input } from '@/components/ui/input';
// +import useRefetch from '@/hooks/use-refetch';
//  import { api } from '@/trpc/react';
//  import React from 'react';
//  import { useForm } from 'react-hook-form'
// @@ -16,6 +17,7 @@ type FormInput = {
//  const CreatePage = () => {
//      const { register, handleSubmit, reset } = useForm<FormInput>()
//      const createProject = api.project.createProject.useMutation();
// +    const refetch = useRefetch()
 
//      function onSubmit(data: FormInput) {
//          // console.log(data)
// @@ -26,6 +28,7 @@ const CreatePage = () => {
//          }, {
//              onSuccess: () => {
//                  toast.success("project creation success")
// +                refetch();
//                  reset()
//              },
//              onError: () => {
// diff --git a/src/app/(protected)/dashboard/page.tsx b/src/app/(protected)/dashboard/page.tsx
// index 3bd6c5b..26d85e9 100644
// --- a/src/app/(protected)/dashboard/page.tsx
// +++ b/src/app/(protected)/dashboard/page.tsx
// @@ -1,6 +1,7 @@
// -
// +'use client'
 
//  const Dashboard = () => {
// +    
//      return(
//          <div>
//              HIII
// diff --git a/src/hooks/use-project.ts b/src/hooks/use-project.ts
// new file mode 100644
// index 0000000..6b44257
// --- /dev/null
// +++ b/src/hooks/use-project.ts
// @@ -0,0 +1,14 @@
// +import { api } from '@/trpc/react';
// +import { useLocalStorage } from 'usehooks-ts'
// +
// +export const useProject = () => {
// +    const { data: projects } = api.project.getProject.useQuery()
// +    const [projectId, setProjectId] = useLocalStorage("ProjectId","")
// +    const project = projects?.find(x => x.id === projectId)
// +    return {
// +        projects,
// +        project,
// +        projectId,
// +        setProjectId
// +    }
// +}
// \ No newline at end of file
// diff --git a/src/hooks/use-refetch.ts b/src/hooks/use-refetch.ts
// new file mode 100644
// index 0000000..dfc5d6f
// --- /dev/null
// +++ b/src/hooks/use-refetch.ts
// @@ -0,0 +1,13 @@
// +import { useQueryClient } from "@tanstack/react-query"
// +
// +
// +const useRefetch = () => {
// +    const queryClient = useQueryClient()
// +    return async() => {
// +        await queryClient.refetchQueries({
// +            type: "active"
// +        })
// +    }
// +}
// +
// +export default useRefetch;
// \ No newline at end of file
// diff --git a/src/server/api/routers/project.ts b/src/server/api/routers/project.ts
// index 1fac6d4..de8a12f 100644
// --- a/src/server/api/routers/project.ts
// +++ b/src/server/api/routers/project.ts
// @@ -22,5 +22,17 @@ export const projectRouter = createTRPCRouter({
//          })
 
//          return project
// +    }),
// +    getProject: protectedProcedure.query( async({ctx}) => {
// +        return await ctx.db.project.findMany({
// +            where: {
// +                userToProject: {
// +                    some: {
// +                        userId: ctx.user.userId!
// +                    }
// +                },
// +                deletedAt: null
// +            }
// +        })
//      })
//  })
// \ No newline at end of file

// `

// const a = await summariseCommit(dif);

// console.log(JSON.stringify(a))

// console.log(await generateEmbeddings("asdasdasd"))