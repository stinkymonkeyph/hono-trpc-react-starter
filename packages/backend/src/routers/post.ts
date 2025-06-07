import { z } from 'zod'
import { router, publicProcedure } from '../lib/trpc.js'

export const postRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        authorId: z.string(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.create({
        data: input,
        include: {
          author: true,
        },
      })
    }),

  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      const where = input?.published !== undefined
        ? { published: input.published }
        : {}

      return await ctx.prisma.post.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: {
          author: true,
        },
      })
      if (!post) {
        throw new Error('Post not found')
      }
      return post
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input
      return await ctx.prisma.post.update({
        where: { id },
        data,
        include: {
          author: true,
        },
      })
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.delete({
        where: { id: input.id },
      })
    }),

  publish: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.update({
        where: { id: input.id },
        data: { published: true },
        include: {
          author: true,
        },
      })
    }),
})
