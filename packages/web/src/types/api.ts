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

export interface AppRouter {
  user: {
    getAll: () => Promise<User[]>
    create: (input: { email: string; name: string }) => Promise<User>
    getById: (input: { id: string }) => Promise<User>
    update: (input: { id: string; email?: string; name?: string }) => Promise<User>
    delete: (input: { id: string }) => Promise<User>
  }
  post: {
    getAll: (input?: { published?: boolean }) => Promise<Post[]>
    create: (input: { title: string; content?: string; authorId: string; published?: boolean }) => Promise<Post>
    getById: (input: { id: string }) => Promise<Post>
    update: (input: { id: string; title?: string; content?: string; published?: boolean }) => Promise<Post>
    delete: (input: { id: string }) => Promise<Post>
    publish: (input: { id: string }) => Promise<Post>
  }
}
