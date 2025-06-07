import { router } from '../lib/trpc.js'
import { userRouter } from './user.js'
import { postRouter } from './post.js'

export const appRouter = router({
  user: userRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
