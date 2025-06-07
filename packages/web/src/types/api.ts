export interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
  posts: Post[]
}

export interface Post {
  id: string
  title: string
  content: string | null
  published: boolean
  authorId: string
  createdAt: string
  updatedAt: string
}

export type AppRouter = {
  user: {
    create: {
      input: { email: string; name?: string }
      output: User
    }
    getAll: {
      input: void
      output: User[]
    }
    getById: {
      input: { id: string }
      output: User
    }
    update: {
      input: { id: string; email?: string; name?: string }
      output: User
    }
    delete: {
      input: { id: string }
      output: User
    }
  }
  post: {
    create: {
      input: { title: string; content?: string; authorId: string; published?: boolean }
      output: Post
    }
    getAll: {
      input: { published?: boolean }
      output: Post[]
    }
    getById: {
      input: { id: string }
      output: Post
    }
    update: {
      input: { id: string; title?: string; content?: string; published?: boolean }
      output: Post
    }
    delete: {
      input: { id: string }
      output: Post
    }
    publish: {
      input: { id: string }
      output: Post
    }
  }
}
