import { pollCommits } from "@/lib/github";
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from 'zod';
import { indexGithubRepo } from "@/lib/load-repo";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ ctx, input }) => {
        const project = await ctx.db.project.create({
            data: {
                githubUrl: input.githubUrl,
                name: input.name,
                userToProject: {
                    create: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken)
        await pollCommits(project.id);
        return project
    }),

    getProject: protectedProcedure.query(async ({ ctx }) => {
        console.log("userrr", ctx.user.userId)
        const projects = await ctx.db.project.findMany({
            where: {
                userToProject: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                // deletedAt: null
            }
        })
        console.log(projects, "projectsssss")
        // if (!projects) {
        //     console.log("No projects found")
        //     return "No porjects found"
        // }
        return projects
    }),

    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        console.log(input.projectId, "projectId Arg")
        return await ctx.db.commit.findMany({
            where: {
                projectId: input.projectId
            }
        })
    }),

    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        filesReferences: z.any(),
        answer: z.string()
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.question.create({
            data: {
                projectId: input.projectId,
                fileReferences: input.filesReferences,
                answer: input.answer,
                userId: ctx.user.userId!,
                question: input.question
            }
        })
    }),

    getQuestions: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
        return await ctx.db.question.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }),

    uploadMeeting: protectedProcedure.input(z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string()
    }))
        .mutation(async ({ ctx, input }) => {
            const meeting = await ctx.db.meeting.create({
                data: {
                    meetingUrl: input.meetingUrl,
                    name: input.name,
                    projectId: input.projectId,
                    status: 'PROCESSING'
                }
            })
        }),

    getMeetings: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        return await ctx.db.meeting.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                issues: true
            }
        })
    })
})