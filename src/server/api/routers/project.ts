import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from 'zod';

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
                }
            }
        })

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
        console.log(projects)
        // if (!projects) {
        //     console.log("No projects found")
        //     return "No porjects found"
        // }
        return projects
    })
})