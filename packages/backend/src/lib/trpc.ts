import { initTRPC } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from './prisma.js'

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    prisma,
    req: opts.req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
